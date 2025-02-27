import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (request: Request) => {
  const { previousQuestion, question, paymentID } = await request.json();

  if (!question) {
    return NextResponse.json({ reply: "Question is required" });
  }

  if (!paymentID) {
    return NextResponse.json({ reply: "Paymentid is required" });
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
      `${process.env.MONGODB_DATA_API}` + "/action/findOne",
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
          database: `${process.env.MongoDB_Database}`,
          dataSource: `${process.env.MongoDB_DataSource}`,
          projection: {
            _id: 1,
            session_end: 1,
          },
          filter: {
            _id: { $oid: `${paymentID}` },
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
      const sessionEndTime = new Date(MongoData.document.session_end).getTime();
      const timeDifference = sessionEndTime - currentTime;

      if (timeDifference > 0) {
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
                max_tokens: 300,
                temperature: 0.1,
                messages: [
                  {
                    role: "user",
                    content: `${previousQuestion || ""}`,
                  },
                  {
                    role: "system",
                    content:
                      "Possibly Provide a concise, short answer (<40 words) without repeating question.",
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
        // if the time is expired then update the session status to "completed"
        return NextResponse.json({ reply: "Session expired!!" });
      }
    } else {
      console.log("paymentid is invalid");
      return NextResponse.json({ reply: "Paymentid is invalid" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
