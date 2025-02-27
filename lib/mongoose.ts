import mongoose from "mongoose";

let isConnected: boolean = false;

const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MISSING MONGODB_URL");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "voice",
    });

    isConnected = true;
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};

export default connectToDatabase;
