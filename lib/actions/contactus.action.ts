"use server";
import Contactus from "../../database/contactus.model";
import connectToDatabase from "../mongoose";
import { CreateContactusParams } from "./shared.types";

export async function createContactus(params: CreateContactusParams) {
  try {
    await connectToDatabase();

    const { email, author, subject, message } = params;

    const contactus = new Contactus({
      email,
      author,
      subject,
      message,
    });
    await contactus.save({ timeout: 10000 }); // Increase timeout to 30 seconds
    return {
      message:
        "Your Enquiry Submitted. Please give us 24 hours to respond. Check your Spam folder if you don't see our email.",
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create Form");
  }
}
