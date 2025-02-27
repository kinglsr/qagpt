"use server";
import Code from "../../database/validatecode.model";
import connectToDatabase from "../mongoose";

export async function createCode(user: string, code: string) {
  try {
    await connectToDatabase();
    const usercode = new Code({
      user,
      code,
    });
    if (!usercode.code) {
      usercode.code = "Missed Code";
    }
    if (!usercode.user) {
      usercode.user = "Missed user";
    }

    await usercode.save({ timeout: 10000 }); // Increase timeout to 30 seconds
    return { message: "Code Not Succefully updated" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create code");
  }
}

export async function getcodes(user: string, code: string) {
  try {
    await connectToDatabase();
    const LastValidcode = await Code.find({}, "code user", {
      sort: { createdAt: -1 },
    });
    console.log("lastcode", LastValidcode[0].code);
    return { code: LastValidcode[0].code };
  } catch (err) {
    console.error(err);
  }
}
