"use server";
import { getUserById, getUserDetailsById } from "../../lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const getMongoUserId = async () => {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    // Redirect the user to the sign-in page if they're not authenticated
    window.location.href = "/sign-in";
    return null;
  }

  const mongoUser = await getUserById({ userId: clerkId });
  const mongoUserId = mongoUser.toString();
  // print the last 5 characters of the mongoUserId and 5 characters of the clerkId on console to debug
  console.log(
    "mongoUserId: ",
    mongoUserId.slice(-5),
    "clerkId: ",
    clerkId.slice(-5)
  );
  return mongoUserId;
};

export const getMongoUserDetails = async () => {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    // Redirect the user to the sign-in page if they're not authenticated
    window.location.href = "/sign-in";
    return null;
  }

  const mongoUser = await getUserDetailsById({ userId: clerkId });
  const mongoUserdetails = mongoUser;
  return mongoUserdetails;
};

export default getMongoUserId;
