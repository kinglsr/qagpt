/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TrailMockInterview from "./TrailMockInterview";
import TrailSpeechtoText from "./TrailSpeechtoText";
import LangDropdown from "@/components/shared/LangDropdown";

export default function Page() {
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);

  return (
    <>
      <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
        <div className="flex flex-wrap justify-center gap-10">
          <Button
            className="flex2 paragraph-medium mr-2 mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
            onClick={() => {
              setShowMockInterview(false);
              setShowSpeechToText(true);
            }}
          >
            Ask Questions
          </Button>
          <Button
            className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
            onClick={() => {
              setShowMockInterview(true);
              setShowSpeechToText(false);
            }}
          >
            Mock Interview
          </Button>
          <LangDropdown />
        </div>
      </div>
      <div className="flex h-screen flex-col justify-end">
        {showSpeechToText && <TrailSpeechtoText />}
        {showMockInterview && <TrailMockInterview />}
      </div>
    </>
  );
}
