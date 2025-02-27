import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (request: Request) => {
  const { previousQuestion, question, author } = await request.json();

  if (!question) {
    return NextResponse.json({ reply: "Question is required" });
  }

  if (!author) {
    return NextResponse.json({ reply: "Author is required" });
  }

  // check message for profanity
  const Filter = require("bad-words");
  const profanityFilter = new Filter();
  if (profanityFilter.isProfane(question, previousQuestion)) {
    console.log("Profanity detected in the message.");
    return NextResponse.json({ reply: "Profanity detected in the message." });
  }

  try {
    const mongoresponse = await fetch(
      `${process.env.MONGODB_DATA_API}` + "/action/find",
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
            author: { $oid: `${author}` },
          },
          limit: 7,
        }),
      }
    );

    const MongoData = await mongoresponse.json();
    console.log(MongoData);
    // count the number of questions asked by the user
    const questionCount = MongoData.documents.length;

    if (questionCount < 5) {
      // calculate the time difference between session_end and now
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4-1106-preview",
              max_tokens: 100,
              temperature: 0.1,
              messages: [
                {
                  role: "user",
                  content: `${previousQuestion || ""}`,
                },
                {
                  role: "system",
                  content:
                    "Possibly Provide a concise, short answer (<40 words) without repeating the question",
                },
                {
                  role: "assistant",
                  content: "Act like an interviewee and answer the question.",
                },
                {
                  role: "user",
                  content: `${question}`,
                },
              ],
            }),
          }
        );

        const responseData = await response.json();
        return NextResponse.json({ responseData });
      } catch (error: any) {
        return NextResponse.json({ error: error.message });
      }
    } else {
      console.log("You have reached the number of Limits");
      // if the count > 5 return number of limits reached
      return NextResponse.json({
        reply: "limit reached",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
