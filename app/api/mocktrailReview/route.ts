import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { validateLanguage } from "@/lib/validateLanguage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  // Wrap with a try/catch to handle API errors
  try {
    const { mockQuestion, userAnswer, authorID, lang } = await req.json();
    // import validateLanguage function from lib/validateLanguage.ts
    if (!validateLanguage(lang)) {
      return new Response("Invalid Language", {
        status: 303,
      });
    }

    if (!mockQuestion || !userAnswer) {
      return new Response("Redo Again", {
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
    if (profanityFilter.isProfane(mockQuestion, userAnswer)) {
      return new Response("Profanity detected in the message", {
        status: 303,
      });
    }

    try {
      const mongoresponse = await fetch(
        `${process.env.MONGODB_DATA_API}/action/find`,
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
            collection: "questions",
            database: "voice",
            dataSource: `${process.env.MongoDB_DataSource}`,
            projection: {
              _id: 1,
            },
            filter: {
              author: { $oid: `${authorID}` },
              type: { $eq: "mock" },
            },
            limit: 11,
          }),
        }
      );

      const MongoData = await mongoresponse.json();
      // count the number of questions asked by the user
      const questionCount = MongoData.documents.length;
      if (questionCount >= 10) {
        // Given incoming request /home
        return new Response(
          "Your have Recieved Feedback for 10 Questions. Please Purchase Thank you 😇",
          {
            status: 303,
          }
        );
      } else {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [
              {
                role: "system",
                content:
                  "You are a hiring manager. You are to provide feedback on the answer to the question first. You are also answer the question.If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the candidate's response.",
              },
              {
                role: "user",
                content:
                  "question: " +
                  mockQuestion +
                  "and user answer " +
                  userAnswer +
                  ".",
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
