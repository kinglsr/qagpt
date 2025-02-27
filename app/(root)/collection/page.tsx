"use client";
import QuestionCard from "@/components/collection/cards/QuestionCard";
import LocalSearchbar from "@/components/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import { getQuestions } from "@/lib/actions/questions.action";
import React, { useEffect, useState } from "react";
import { SearchParamsProps } from "@/types";
import CollectionFilters from "@/components/collection/CollectionFilters";
import { CollectionPageFilters } from "@/constants/filters";
import getMongoUserId from "@/components/shared/GetMongouserDetails";

const Collections: React.FC<SearchParamsProps> = ({ searchParams }) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [result, setResult] = useState<any>({
    questions: [],
    isNext: false,
    totalCount: 0,
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getMongoUserId();
      setUserID(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (userID) {
        const res = await getQuestions({
          author: userID,
          searchQuery: searchParams.q || "",
          filter: searchParams.filter,
          page: searchParams.page ? +searchParams.page : 1,
        });
        setResult(res);
      }
    };
    fetchQuestions();
  }, [userID, searchParams]);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          Collections: {result.totalCount}
        </h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={CollectionPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <CollectionFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any, index: number) => (
            <QuestionCard
              key={index}
              questions={question.questions}
              answers={
                question.answers &&
                question.answers
                  .split("\n")
                  .map((line: string, index: number) => (
                    <React.Fragment key={index}>
                      {line.includes("```") ? (
                        <code>{line}</code>
                      ) : line.includes("User Answer:") ? (
                        <>
                          <span style={{ color: "red" }}> 😇 {line}</span>
                          <br />
                        </>
                      ) : line.includes("QAGPT AI Feedback:") ? (
                        <>
                          <span style={{ color: "green" }}>🤖 {line}</span>
                          <br />
                        </>
                      ) : (
                        <React.Fragment>{line}</React.Fragment>
                      )}
                      <br />
                    </React.Fragment>
                  ))
              }
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            key="no-result"
            title="There’s no question to show"
            description=" 🚀 When we say ASK, we mean literally saying something out loud. So, get involved and kickstart the discussion with a question or a topic you'd like to talk about! 💡"
            link="/qagpt"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Collections;
