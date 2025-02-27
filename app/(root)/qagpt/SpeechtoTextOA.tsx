"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  createErrors,
  createQuestion,
} from "../../../lib/actions/questions.action";
import getMongoUserId from "../../../components/shared/GetMongouserDetails";
import LangDropdown from "@/components/shared/LangDropdown";

interface SpeechToTextProps {
  paymentID: string;
  endTime: string;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ paymentID, endTime }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechOutput, setSpeechOutput] = useState("");
  const [finalOutput, setFinalOutput] = useState("");
  const [streamData, setStreamData] = useState("");
  const userIdRef = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const paymnetIdRef = paymentID;
  const dialect = localStorage.getItem("dialect") || "en-US";

  useEffect(() => {
    localStorage.setItem("finalOutput", "");
  }, []);

  // @ts-ignore
  // eslint-disable-next-line no-undef
  const recognitionRef = useRef<webkitSpeechRecognition | null>(null);
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getMongoUserId();
      userIdRef.current = id;
    };
    if (!userIdRef.current) {
      fetchUserId();
    }
  }, []);

  const startListening = () => {
    // @ts-ignore
    // eslint-disable-next-line no-undef, new-cap
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechOutput("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimResult = "";
      let finalResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalResult += transcript;
        } else {
          interimResult += transcript;
        }
      }
      setSpeechOutput(interimResult);
      setFinalOutput((prevOutput) => prevOutput + finalResult);

      clearTimeout(timeoutRef.current!);
      timeoutRef.current = setTimeout(stopListening, 9000);
    };

    recognitionRef.current = recognition;
    recognition.lang = dialect;
    recognition.start();
  };

  const stopListening = async () => {
    try {
      if (isListening) {
        recognitionRef.current?.stop();
        clearTimeout(timeoutRef.current!);
        setIsListening(false);

        if (finalOutput === "") return;
        try {
          const controller = new AbortController();
          controllerRef.current = controller;
          const response = await fetch("/api/chatgptstream", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              previousQuestion: localStorage.getItem("finalOutput") || "",
              question: finalOutput,
              paymentID: paymnetIdRef!,
              authorID: userIdRef.current!,
              lang: dialect,
            }),
            signal: controller.signal,
          });
          if (response.status === 303) {
            const reader = response.body!.getReader();
            let answer = "";
            const processStream = async () => {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                try {
                  const text = new TextDecoder().decode(value);
                  setStreamData((prevData) => prevData + text);
                  answer += text; // Append the text to the answer variable
                } catch (error) {
                  console.log("Error in processing stream:", error);
                  // Handle the error as needed
                }
              }
            };
            processStream()
              .then(() => {
                return createErrors({
                  questions: finalOutput,
                  errorsgpt: answer,
                  // @ts-ignore
                  paymentId: paymnetIdRef!,
                  author: userIdRef.current!,
                });
              })
              .then(() => {
                console.log("Question created successfully");
                // Additional code to execute after createQuestion is completed
                localStorage.setItem("finalOutput", finalOutput);
              })
              .catch((error) => {
                console.log(
                  "Error in processing stream or creating question:",
                  error
                );
                // Handle the error as needed
              });
          } else {
            const reader = response.body!.getReader();
            let answer = "";
            const processStream = async () => {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                try {
                  const text = new TextDecoder().decode(value);
                  setStreamData((prevData) => prevData + text);
                  answer += text; // Append the text to the answer variable
                } catch (error) {
                  console.log("Error in processing stream:", error);
                  // Handle the error as needed
                }
              }
            };

            processStream()
              .then(() => {
                return createQuestion({
                  questions: finalOutput,
                  answers: answer,
                  // @ts-ignore
                  paymentId: paymnetIdRef!,
                  author: userIdRef.current!,
                  lang: dialect,
                });
              })
              .then(() => {
                console.log("Question created successfully");
                localStorage.setItem("finalOutput", finalOutput);
              })
              .catch((error) => {
                createQuestion({
                  questions: finalOutput,
                  answers: answer,
                  // @ts-ignore
                  paymentId: null,
                  author: userIdRef.current!,
                  lang: dialect,
                });
                console.log(
                  "Error in processing stream or creating question:",
                  error
                );
                // Handle the error as needed
              });
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelListening = () => {
    recognitionRef.current?.stop();
    clearTimeout(timeoutRef.current!);
    setIsListening(false);
    setFinalOutput("");
    setStreamData("");
    stop();
  };

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      stop();
      setFinalOutput("");
      setStreamData("");
      startListening();
    }
  };

  const stop = () => {
    controllerRef.current && controllerRef.current.abort();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <LangDropdown />
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h3 className="h1-bold text-dark100_light900 mr-6 ">
          Start Asking Questions
        </h3>
        <p className="text-dark100_light900 text-sm">
          {endTime ? `Session ends at ${endTime}` : ""}
        </p>
      </div>
      <Button
        className={`small-medium min-h-[60px] w-full rounded-lg px-4 py-3 shadow-none ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={handleButtonClick}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </Button>
      <div className="mt-4 rounded-lg bg-gray-800 p-4 text-center font-thin text-white shadow-lg">
        😇:{" "}
        {finalOutput.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {index > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
        {speechOutput && <div className="mt-4 text-white">{speechOutput}</div>}
      </div>
      <Button
        className="mt-4 rounded-lg bg-red-500 px-4 py-3 text-white shadow-none hover:bg-red-600"
        onClick={stop}
      >
        Stop Answer!!
      </Button>
      <div className="mt-4 overflow-y-auto rounded-lg bg-gray-800 p-4 text-center font-thin text-white shadow-lg">
        🤖:{" "}
        {streamData.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line.includes("```") ? <code>{line}</code> : <span>{line}</span>}
            <br />
          </React.Fragment>
        ))}
      </div>
      <Button
        className=" mt-4 rounded-lg bg-red-500 px-4 py-3 text-white shadow-none hover:bg-red-600"
        onClick={cancelListening}
      >
        Reset
      </Button>
    </div>
  );
};

export default SpeechToText;
