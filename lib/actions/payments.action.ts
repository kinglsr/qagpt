"use server";
import Payments from "@/database/payments.model";
import connectToDatabase from "../mongoose";
import { FilterQuery } from "mongoose";
import { GetPaymentsParams } from "./shared.types";

export async function createPaymentDetails(paymentData: any) {
  try {
    connectToDatabase();
    await Payments.create(paymentData);
    console.log("payment: successfully added in DB");
  } catch (error) {
    console.log("payment: Failed to added DB");
    console.log(error);
    throw error;
  }
}

export async function getpayments(params: GetPaymentsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 20 } = params;

    // Calculcate the number of last payments to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Payments> = {
      client_reference_id: userId,
    };

    const payments = await Payments.find(query, {
      _id: 0,
      invoice: 1,
      line_items: 1,
      payment_status: 1,
      amount_total: 1,
      created: 1,
      session_vgpt: 1,
      session_start: 1,
      session_end: 1,
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ created: -1 });

    const plainpayments = payments.map((payment) => payment.toObject());

    const totalpayments = await Payments.countDocuments(query);
    const isNext = totalpayments > skipAmount + plainpayments.length;

    return { payments: plainpayments, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
