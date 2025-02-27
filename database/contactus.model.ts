import { Schema, models, model, Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  author: Schema.Types.ObjectId[];
  subject: string;
  mesage: string;
  createdAt: Date;
}

const ContactusSchema = new Schema({
  email: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contactus = models.Contactus || model("Contactus", ContactusSchema);

export default Contactus;
