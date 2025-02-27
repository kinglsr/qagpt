"use server";
import Payments from "@/database/payments.model";
import connectToDatabase from "../mongoose";
import { FilterQuery } from "mongoose";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// check time validation if the session is in progress

export async function checkTimer(sessionEnd: Date, checkoutId: string) {
  try {
    const currentTime = new Date().getTime();
    const sessionEndTime = sessionEnd.getTime();
    const timeDifference = sessionEndTime - currentTime;

    if (timeDifference > 0) {
      return true;
    } else {
      // if the time is expired then update the session status to "completed"
      updateSessionStatusToComplete(checkoutId, "completed", 3);
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update session status to "completed"
export async function updateSessionStatusToComplete(
  checkoutId: string,
  sessionStatus: string,
  ver?: number
) {
  try {
    connectToDatabase(); // Connect to your MongoDB database

    const query: FilterQuery<typeof Payments> = {
      id: checkoutId,
    };
    // eslint-disable-next-line
    const upsession = await Payments.findOneAndUpdate(query, {
      session_vgpt: sessionStatus,
      __v: ver,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update session status to "progress" and create session start time , end time
export async function updateNewSessionStatusToProgress(
  checkoutId: string,
  sessionStatus: string,
  productName?: string,
  ver?: number
) {
  try {
    connectToDatabase(); // Connect to your MongoDB database

    // Create session start time and end time, where end time is session start time + 2 hours for a 2-hour session and 1 hour for a 1-hour session
    const sessionStartTime = new Date();
    const sessionEndTime = new Date(sessionStartTime);

    if (productName === "Two hour session") {
      sessionEndTime.setHours(sessionEndTime.getHours() + 2);
    } else if (productName === "1 hour session") {
      sessionEndTime.setHours(sessionEndTime.getHours() + 1);
    }
    const query: FilterQuery<typeof Payments> = {
      id: checkoutId,
    };

    // eslint-disable-next-line
    const upsession = await Payments.findOneAndUpdate(query, {
      session_vgpt: sessionStatus,
      session_start: sessionStartTime,
      session_end: sessionEndTime,
      __v: ver,
    });
    return sessionEndTime;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// this session checks for any new sessions available if not return "no new sessions available"
export async function getSessionNew(userId: string) {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof Payments> = {
      client_reference_id: userId,
      session_vgpt: "new",
    };
    // console.log(query);

    const session = await Payments.findOne(query, {
      id: 1,
      session_vgpt: 1,
      session_start: 1,
      line_items: 1,
      client_reference_id: 1,
    })
      .sort({ session_start: 1 })
      .limit(1);

    if (session) {
      JSON.parse(JSON.stringify(session._id));

      // eslint-disable-next-line
      const sessionEnd = await updateNewSessionStatusToProgress(
        session.id,
        "progress",
        session.line_items.data[0].description,
        1
      );
      // add the session end time to the session object
      session.session_end = sessionEnd;
      return session.toObject();
    } else {
      return { message: "no sessions" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// create getSessionInfo function based on the user id from Payments model only the session.vgpt = "new", if no records found then return "no session found for this user"
export async function getSessionInfo(userId: string) {
  try {
    // console.log("I am from getSessionInfo", userId);
    connectToDatabase();
    const query: FilterQuery<typeof Payments> = {
      client_reference_id: userId,
      session_vgpt: "progress",
    };

    const session = await Payments.findOne(query, {
      id: 1,
      session_vgpt: 1,
      session_start: 1,
      session_end: 1,
      line_items: 1,
      client_reference_id: 1,
    })
      .sort({ session_start: 1 })
      .limit(1);

    if (session) {
      // check if any time left for the progress session
      const timer = await checkTimer(session.session_end, session.id);
      // console.log("I am from timer", timer);
      if (timer) {
        //  console.log("I am from progress", session.toObject());
        return session.toObject();
      } else {
        // if there is progress session available but the time is expired then check for any new sessions available
        const sessionNew = await getSessionNew(userId);
        //  console.log("I am from new", sessionNew);
        return sessionNew;
      }
    } else {
      // if no progress session found then check for any new sessions available
      const sessionNew = await getSessionNew(userId);
      //  console.log("I am from new", sessionNew);
      return sessionNew;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// create a function to take the objectid and calculate the time difference between the current time and session start time and if the time difference is greater than 2 hours
// for 2 hour session and 1 hour for 1 hour session then route the page to the qa gpt page and update the session status to "completed" and update the session start time
export async function checkSessionTimer(paymentID: any) {
  const query: FilterQuery<typeof Payments> = {
    _id: paymentID,
  };

  const session = await Payments.findOne(query, {
    id: 1,
    session_end: 1,
    session_vgpt: 1,
  });
  if (session.session_vgpt === "completed") {
    redirect(`${headers().get("origin")}/purchase`);
  } else {
    const timecheck = await checkTimer(session.session_end, session.id);
    if (timecheck === false) {
      redirect(`${headers().get("origin")}/purchase`);
    } else {
      console.log("session is valid");
    }
  }
}
