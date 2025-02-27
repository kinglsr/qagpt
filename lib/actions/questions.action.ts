"use server";

import { FilterQuery } from "mongoose";
import Question from "../../database/question.model";
import connectToDatabase from "../mongoose";
import {
  CreateAIMockQuestionParams,
  CreateErrorsParams,
  CreateMockQuestionParams,
  CreateQuestionParams,
  GetQuestionsParams,
} from "./shared.types";
import AIQuestion from "@/database/generatedaiquestions.model";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { questions, author, answers, paymentId, lang } = params;

    const question = new Question({
      questions,
      author,
      answers,
      paymentId,
      lang,
    });
    if (!question.questions) {
      question.questions = "Missed Question";
    }
    if (!question.answers) {
      question.answers = "Missed Answer";
    }
    await question.save({ timeout: 1000 }); // 1 seconds
    return { message: "Question and Answer created successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create question");
  }
}

export async function createErrors(params: CreateErrorsParams) {
  try {
    await connectToDatabase();

    const { questions, author, errorsgpt, paymentId } = params;

    const question = new Question({
      questions,
      author,
      errorsgpt,
      paymentId,
    });
    if (!question.questions) {
      question.questions = "Missed Question";
    }
    await question.save({ timeout: 1000 }); // 1 seconds
    return { message: "Question and Error created successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create question");
  }
}

export async function createMockQuestion(params: CreateMockQuestionParams) {
  try {
    await connectToDatabase();

    const { questions, type, author, answers, paymentId, lang } = params;

    const question = new Question({
      questions,
      type,
      author,
      answers,
      paymentId,
      lang,
    });
    if (!question.questions) {
      question.questions = "Missed Question";
    }
    if (!question.answers) {
      question.answers = "Missed Answer";
    }
    await question.save({ timeout: 1000 }); // 1 seconds
    return { message: "Question and Answer created successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create question");
  }
}

// save just ai questions to database
export async function createAIMockQuestion(params: CreateAIMockQuestionParams) {
  try {
    await connectToDatabase();

    const { questions, author, paymentId } = params;
    const question = new AIQuestion({
      questions,
      author,
      paymentId,
    });
    if (!question.questions) {
      question.questions = "Missed Question";
    }
    await question.save({ timeout: 1000 }); // 1 seconds
    return { message: "AI Generated Question created successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create question");
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const {
      author,
      searchQuery,
      filter = "newest",
      page = 1,
      pageSize = 15,
    } = params;

    // Calculcate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {
      author,
    };

    if (searchQuery) {
      query.$or = [
        { questions: { $regex: new RegExp(searchQuery, "i") } },
        { answers: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query, {
      questions: 1,
      answers: 1,
      createdAt: 1,
      _id: 0,
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const plainQuestions = questions.map((question) => question.toObject());

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + plainQuestions.length;
    return { questions: plainQuestions, isNext, totalCount: totalQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
