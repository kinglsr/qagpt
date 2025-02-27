"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  createAIMockQuestion,
  createErrors,
  createMockQuestion,
} from "../../../lib/actions/questions.action";
import getMongoUserId from "@/components/shared/GetMongouserDetails";
import DialogMock from "@/components/shared/DialogMock";

const TrailMockInterview: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [speechOutput, setSpeechOutput] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [finalMockOutput, setFinalMockOutput] = useState("");
  const [finalOutput, setFinalOutput] = useState("");
  const userIdRef = useRef<string | null>(null);
  const [streamMockData, setStreamMockData] = useState("");
  const [streamData, setStreamData] = useState("");
  const controllerRef = useRef<AbortController | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dialect = localStorage.getItem("dialect") || "en-US";

  const handleConfirm = async () => {
    setShowModal(false);
  };

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

  // get interview question
  const getInterviewQuestion = async () => {
    setStreamMockData("");
    if (
      localStorage.getItem("mock.role") === "" ||
      localStorage.getItem("mock.description") === "" ||
      localStorage.getItem("mock.level") === ""
    ) {
      return alert("Please set up your mock interview settings");
    }
    try {
      const response = await fetch("/api/mocktrails/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: localStorage.getItem("mock.role") || "",
          description: localStorage.getItem("mock.description") || "",
          level: localStorage.getItem("mock.level") || "",
          authorID: userIdRef.current!,
        }),
      });
      if (response.status === 303) {
        const reader = response.body!.getReader();
        let mockquestion = "";
        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            try {
              const text = new TextDecoder().decode(value);
              setStreamMockData((prevData) => prevData + text);
              mockquestion += text; // Append the text to the answer variable
            } catch (error) {
              console.log("Error in processing stream:", error);
              // Handle the error as needed
            }
          }
        };

        processStream().then(() => {
          setFinalMockOutput(mockquestion);
          createAIMockQuestion({
            questions: localStorage.getItem("setFinalMockOutput") || "",
            paymentId: null,
            author: userIdRef.current!,
          });
          return localStorage.setItem("setFinalMockOutput", "");
        });
      } else {
        const reader = response.body!.getReader();
        let mockquestion = "";
        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            try {
              const text = new TextDecoder().decode(value);
              setStreamMockData((prevData) => prevData + text);
              mockquestion += text; // Append the text to the answer variable
            } catch (error) {
              console.log("Error in processing stream:", error);
              // Handle the error as needed
            }
          }
        };

        processStream().then(() => {
          setFinalMockOutput(mockquestion);
          localStorage.setItem("setFinalMockOutput", mockquestion);
          return createAIMockQuestion({
            questions: localStorage.getItem("setFinalMockOutput") || "",
            paymentId: null,
            author: userIdRef.current!,
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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

    recognition.onresult = (event: {
      resultIndex: any;
      results: string | any[];
    }) => {
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

        // if the page is loaded on mobile device, then alert the user to use desktop
        if (window.innerWidth < 768) {
          alert("For Best Experience Use Laptop or Desktop");
        }

        // if the userIdRef.current is null, then recall the fetchUserId function
        if (!userIdRef.current) {
          const id = await getMongoUserId();
          userIdRef.current = id;
        }

        if (finalOutput === "") return alert("No Input");
        if (localStorage.getItem("setFinalMockOutput") === "") {
          setStreamMockData("");
          return alert("Please generate New interview question");
        }
        try {
          const controller = new AbortController();
          controllerRef.current = controller;
          const response = await fetch("/api/mocktrailReview/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mockQuestion: localStorage.getItem("setFinalMockOutput") || "",
              userAnswer: finalOutput,
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
                  questions: localStorage.getItem("setFinalMockOutput") || "",
                  errorsgpt: answer,
                  // @ts-ignore
                  paymentId: null,
                  author: userIdRef.current!,
                });
              })
              .then(() => {
                console.log("Errors created successfully");
                // Additional code to execute after createQuestion is completed
                localStorage.setItem("setFinalMockOutput", "");
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
                return createMockQuestion({
                  questions: localStorage.getItem("setFinalMockOutput") || "",
                  type: "mock",
                  answers:
                    "User Answer: " +
                    finalOutput +
                    "  \n QAGPT AI Feedback: " +
                    answer,
                  // @ts-ignore
                  paymentId: null,
                  author: userIdRef.current!,
                  lang: dialect,
                });
              })
              .then(() => {
                console.log("Question created successfully");
                localStorage.setItem("setFinalMockOutput", "");
              })
              .catch((error) => {
                createErrors({
                  questions: localStorage.getItem("setFinalMockOutput") || "",
                  errorsgpt: answer,
                  // @ts-ignore
                  paymentId: null,
                  author: userIdRef.current!,
                });
                console.log(
                  "Error in processing stream or creating question:",
                  error
                );
                localStorage.setItem("setFinalMockOutput", "");

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
    setStreamMockData("");
    setFinalOutput("");
    setStreamData("");
    recognitionRef.current?.stop();
    clearTimeout(timeoutRef.current!);
    setIsListening(false);
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
      <Button
        className="paragraph-medium mr-2 mt-4 flex min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
        onClick={() => setShowModal(true)}
      >
        ⚙️ Set up your Mock Interview
      </Button>

      {showModal && <DialogMock onConfirm={handleConfirm} />}
      <h1 className="h1-bold text-dark100_light900">
        Generate 30 Mock Interview Questions for Free !!
      </h1>
      <Button
        className="paragraph-medium mr-2 mt-4 flex min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
        onClick={() => getInterviewQuestion()}
      >
        📝 Generate Interview Question
      </Button>
      <div className="mt-4 rounded-lg bg-gray-800 p-4 text-center font-thin text-white shadow-lg">
        🤖:{" "}
        {streamMockData.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line.includes("```") ? <code>{line}</code> : <span>{line}</span>}
            <br />
          </React.Fragment>
        ))}
      </div>
      <Button
        className={`small-medium mt-4 min-h-[60px] w-full rounded-lg px-4 py-3 shadow-none ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={handleButtonClick}
      >
        {isListening ? "Review Answer" : "Start Record Answer"}
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
        Stop Review!!
      </Button>
      <div className="mt-4 overflow-y-auto rounded-lg bg-gray-800 p-4 text-center font-thin text-white shadow-lg">
        🤖 {"Feedback: "} {"\n"}
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

export default TrailMockInterview;
