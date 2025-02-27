import { ReplicateStream, StreamingTextResponse } from "ai";
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function POST(request: Request) {
  const { question, paymentID, authorID, cancel } = await request.json();

  if (cancel) {
    try {
      const predictionID = await kv.get(authorID);
      if (predictionID !== "" && predictionID !== null) {
        await replicate.predictions.cancel(predictionID!.toString());
        return NextResponse.json({ reply: "Prediction cancelled" });
      } else {
        return NextResponse.json({ reply: "Prediction not found" });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ reply: "error" });
    }
  } else {
    if (!question) {
      return new Response("Question is required", {
        status: 303,
      });
    }

    if (!paymentID) {
      return new Response("Payment is required", {
        status: 303,
      });
    }

    if (!authorID) {
      return new Response("Unauthorized, Please login again!!", {
        status: 303,
      });
    }

    // check message for profanity
    const Filter = require("bad-words");
    const profanityFilter = new Filter();
    if (profanityFilter.isProfane(question)) {
      return new Response("Profanity detected in the message", {
        status: 303,
      });
    }

    try {
      const mongoresponse = await fetch(
        `${process.env.MONGODB_DATA_API}/action/findOne`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key": `${process.env.MONGODB_API_KEY}`,
            "Endpoint-Signature":
              "sha256=ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae",
          },
          body: JSON.stringify({
            collection: "payments",
            database: "voice",
            dataSource: `${process.env.MongoDB_DataSource}`,
            projection: {
              _id: 1,
              session_end: 1,
            },
            filter: {
              _id: { $oid: paymentID },
              session_vgpt: "progress",
            },
          }),
        }
      );

      const MongoData = await mongoresponse.json();

      if (
        MongoData.document !== null &&
        MongoData.document.session_end !== null
      ) {
        // calculate the time difference between session_end and now
        const currentTime = new Date().getTime();
        const sessionEndTime = new Date(
          MongoData.document.session_end
        ).getTime();
        const timeDifference = sessionEndTime - currentTime;

        if (timeDifference > 0) {
          try {
            const prompt = question;
            // cancel the previous prediction if exists
            let versionModel = "";
            const randomNumber = Math.random();

            if (randomNumber < 0.35) {
              versionModel =
                "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d"; // 50% chance for 3
            } else if (randomNumber < 0.7 && randomNumber >= 0.35) {
              versionModel =
                "13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0"; // 35% chance for 2
            } else {
              versionModel =
                "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3"; // 15% chance for 1
            }
            try {
              const predictionID = await kv.get(authorID);
              if (predictionID !== "" && predictionID !== null) {
                await replicate.predictions.cancel(predictionID!.toString());
              }
            } catch (error) {
              console.error("prediction error", error);
              return new Response("Error!!", {
                status: 303,
              });
            }
            const response = await replicate.predictions.create({
              // You must enable streaming.
              stream: true,
              // The model must support streaming. See https://replicate.com/docs/streaming
              // This is the model ID for Llama 2 70b Chat
              version: versionModel,
              // Format the message list into the format expected by Llama 2
              // @see https://github.com/vercel/ai/blob/99cf16edf0a09405d15d3867f997c96a8da869c6/packages/core/prompts/huggingface.ts#L53C1-L78C2
              input: {
                prompt,
                temperature: 0.75,
                debug: false,
                top_p: 1,
                max_new_tokens: 500,
                min_new_tokens: -1,
                system_prompt:
                  "Your Answers should only answer the question once and not have any text after the answer is done, answer in less than 300 words without repeating question or telling about yourself.Spelling mistakes can happen in the prompt, please fix them in your answer.",
              },
            });
            // eslint-disable-next-line no-unused-vars
            const kvset = await kv.set(authorID, response.id);

            // Convert the response into a friendly text-stream
            const stream = await ReplicateStream(response, {
              onCompletion: async (completion: string) => {
                await kv.set(authorID, "");
              },
            });

            // Respond with the stream
            return new StreamingTextResponse(stream);
          } catch (error) {
            console.log("Error in fetching data from Stream", error);
            return new Response("Error!!", {
              status: 303,
            });
          }
        } else {
          // if the time is expired then update the session status to "completed"
          return new Response("Your session ended!! please purchase!!", {
            status: 303,
          });
        }
      } else {
        return new Response("No Valid session found", {
          status: 303,
        });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ reply: "error" });
    }
  }
}
