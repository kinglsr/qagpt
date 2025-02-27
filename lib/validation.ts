import * as z from "zod";

export const QuestionsSchema = z.object({
  questions: z.string().min(0).max(200),
  answers: z.string().min(1000),
  tags: z.array(z.string().min(0).max(15)).min(0).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(5).max(50),
});
