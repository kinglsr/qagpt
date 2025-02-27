import { Schema } from "mongoose";

import { IUser } from "@/mongodb";
import { IPayments } from "@/database/payments.model";

export interface CreateQuestionParams {
  answers: string;
  author: Schema.Types.ObjectId | IUser;
  questions: string | null;
  paymentId: Schema.Types.ObjectId | IPayments | null;
  lang: string | null;
}

export interface CreateErrorsParams {
  errorsgpt: string;
  author: Schema.Types.ObjectId | IUser;
  questions: string;
  paymentId: Schema.Types.ObjectId | IPayments | null;
}

export interface CreateMockQuestionParams {
  answers: string | null;
  type: string | null;
  author: Schema.Types.ObjectId | IUser;
  questions: string | null;
  paymentId: Schema.Types.ObjectId | IPayments | null;
  lang: string | null;
}

export interface CreateAIMockQuestionParams {
  author: Schema.Types.ObjectId | IUser;
  questions: string | null;
  paymentId: Schema.Types.ObjectId | IPayments | null;
}

export interface GetQuestionsParams {
  author: Schema.Types.ObjectId | IUser;
  searchQuery: string;
  filter?: string;
  page?: number;
  pageSize?: number;
}
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface CreateContactusParams {
  email: String;
  author: Schema.Types.ObjectId | IUser;
  subject: String;
  message: String;
}

export interface GetPaymentsParams {
  userId: Schema.Types.ObjectId | IUser;
  page?: number;
  pageSize?: number;
}
