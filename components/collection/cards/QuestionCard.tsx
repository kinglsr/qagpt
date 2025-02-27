import React, { useState } from "react";
import { getTimestamp } from "@/lib/utils";

interface QuestionProps {
  questions: string;
  answers: string;
  createdAt: Date;
}

const QuestionCard = ({ questions, answers, createdAt }: QuestionProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className="card-wrapper rounded-[10px] p-9 sm:px-11"
      onClick={handleExpand}
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 ">
            {getTimestamp(createdAt)}
          </span>
          <h3
            className={`sm:h3-semibold base-semibold text-dark200_light900 mt-1 ${
              expanded ? "" : "line-clamp-1"
            } flex-1`}
          >
            {questions}
          </h3>
          <h5
            className={`sm:paragraph-medium text-dark200_light900  mt-2 ${
              expanded ? "" : "line-clamp-1"
            } flex-1`}
          >
            {answers}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
