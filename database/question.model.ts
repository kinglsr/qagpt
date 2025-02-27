import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
  quetions: string;
  author: Schema.Types.ObjectId[];
  answers: string;
  type: string;
  gptId: string | null;
  gptObject: string | null;
  gptModel: string | null;
  gptCreated: number | null;
  gptFinishReason: string | null;
  gptUsage: {
    prompt_tokens: number | null;
    completion_tokens: number | null;
    total_tokens: number | null;
  };
  gptSystemFingerprint: string | null;
  createdAt: Date;
  paymentId: Schema.Types.ObjectId[];
  stripeId: string;
  errorsgpt: string;
  lang: string;
}

const QuestionSchema = new Schema({
  questions: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answers: { type: String, required: false },
  type: { type: String, required: false },
  gptId: { type: String, required: false },
  gptObject: { type: String, required: false },
  gptModel: { type: String, required: false },
  gptCreated: { type: Number, required: false },
  gptFinishReason: { type: String, required: false },
  gptUsage: {
    prompt_tokens: { type: Number, required: false },
    completion_tokens: { type: Number, required: false },
    total_tokens: { type: Number, required: false },
  },
  gptSystemFingerprint: { type: String, required: false },
  paymentId: { type: Schema.Types.ObjectId, ref: "Payments", required: false },
  stripeId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  errorsgpt: { type: String, required: false },
  lang: { type: String, required: false },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
