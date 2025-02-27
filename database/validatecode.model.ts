import { Schema, models, model, Document } from "mongoose";

export interface ICode extends Document {
  user: String;
  content: string;
  createdAt: Date;
}

const CodeSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Code = models.Code || model("Code", CodeSchema);

export default Code;
