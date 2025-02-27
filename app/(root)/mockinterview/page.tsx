"use client";
import React, { useState } from "react";
import getMongoUserId from "@/components/shared/GetMongouserDetails";
import { Button } from "@/components/ui/button";
import { getSessionInfo } from "@/lib/actions/session.action";
import MockInterview from "./mockinterview";
import Modals from "@/components/shared/Modals";
import Link from "next/link";

function Page() {
  const [showModal, setShowModal] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  const startSession = async () => {
    try {
      const user = await getMongoUserId();
      console.log("User recieved");

      if (user) {
        const response = await getSessionInfo(user);
        setSessionInfo(response);
      }
    } catch (error) {
      console.error("Error fetching session info:", error);
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);
    await startSession();
  };

  return (
    <div>
      {sessionInfo?.message === "no sessions" && (
        <div
          id="alert-additional-content-2"
          className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="me-2 size-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">
              No available Sessions!! Please purchase
            </h3>
          </div>
          <Button
            className="paragraph-medium min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
            onClick={() => {
              // Replace "/purchase" with the actual route for purchasing
              window.location.href = "/purchase";
            }}
          >
            Purchase
          </Button>
        </div>
      )}
      <div className="flex h-screen flex-col items-center justify-start ">
        {sessionInfo?.session_vgpt === "progress" ||
        sessionInfo?.session_vgpt === "new" ? (
          <MockInterview
            paymentID={sessionInfo?._id}
            endTime={sessionInfo?.session_end}
          />
        ) : (
          <div className="card-wrapper flex flex-col-reverse items-center justify-center rounded-[10px] p-9 sm:px-11">
            <div>
              <h1 className="text-dark100_light900 h3-bold">
                Please check our{" "}
                <Link href="/tips">
                  <Button className="paragraph-medium mt-5 min-h-[46px]   rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
                    Tips
                  </Button>
                </Link>{" "}
                page before starting the session for a better experience.
              </h1>
            </div>

            <Button
              className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
              onClick={() => setShowModal(true)}
            >
              Start Mock Interview Session
            </Button>

            {showModal && (
              <Modals
                title="Start Session"
                message="Upon start, the session will automatically end, contingent upon its duration.No Stopping or Pausing. Are you certain you wish to proceed?"
                confirmText="OK"
                onConfirm={handleConfirm}
                onCancel={() => setShowModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
