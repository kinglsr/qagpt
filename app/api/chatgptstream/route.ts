import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { validateLanguage } from "@/lib/validateLanguage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_QAGPT,
});

export const runtime = "edge";

export async function POST(req: Request) {
  // Wrap with a try/catch to handle API errors

  try {
    const { previousQuestion, paymentID, question, authorID, lang } =
      await req.json();

    // import validateLanguage function from lib/validateLanguage.ts
    if (!validateLanguage(lang)) {
      return new Response("Invalid Language", {
        status: 303,
      });
    }
    if (!question) {
      return new Response("Question is required", {
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
    if (profanityFilter.isProfane(question, previousQuestion)) {
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
        if (timeDifference < 0) {
          // Given incoming request /home
          return new Response(
            "Your session ended!! Please Purchase New Session!! Thank you 😇",
            {
              status: 303,
            }
          );
        } else {
          try {
            // generate a random number between 0 and 1
            const modelGPT = Math.random() < 0.8 ? "gpt-4.1" : "gpt-4.1";
            console.log("modelGPT", modelGPT);
            const response = await openai.chat.completions.create({
              model: `${modelGPT}`,
              max_tokens: 500,
              temperature: 0.2,
              stream: true,
              messages: [
                {
                  role: "user",
                  content: `previous question: ${previousQuestion || ""}`,
                },
                {
                  role: "system",
                  content:
                    "Possibly Provide a concise, short answer (<400 words) without repeating the question",
                },
                {
                  role: "assistant",
                  content:
                    "Your name is QAGPT. You are an interviewee and answer to the question.In this conversation, please use the previous question only if the current question has less content. There is no need to reference the previous question unless the current question requires it ",
                },
                {
                  role: "user",
                  content: `current question: ${question}`,
                },
              ],
            });

            const stream = OpenAIStream(response);

            return new StreamingTextResponse(stream);
          } catch (error) {
            // Check if the error is an APIError
            if (error instanceof OpenAI.APIError) {
              console.log(`Error in fetching data from openAI: ${error}`);
              return new Response("Error!!", {
                status: 303,
              });
            } else {
              throw error;
            }
          }
        }
      }
    } catch (error: any) {
      console.log("Error in fetching data from MongoDB", error);
      return new Response("Error!!", {
        status: 303,
      });
    }
  } catch (error: any) {
    console.log("Error in processing stream or creating question:", error);
    return new Response("Error!!", {
      status: 303,
    });
  }
}
