import { Schema, models, model, Document } from "mongoose";

export interface IAIQuestion extends Document {
  quetions: string;
  author: Schema.Types.ObjectId[];
  createdAt: Date;
  paymentId: Schema.Types.ObjectId[];
}

const AIQuestionSchema = new Schema({
  questions: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  paymentId: { type: Schema.Types.ObjectId, ref: "Payments", required: false },
  createdAt: { type: Date, default: Date.now },
});

const AIQuestion = models.AIQuestion || model("AIQuestion", AIQuestionSchema);

export default AIQuestion;
