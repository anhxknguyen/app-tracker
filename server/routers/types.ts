import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const ApplicationSchema = z.object({
  companyName: z.string().max(255),
  roleTitle: z.string().max(255),
  location: z.string().max(255).optional(),
  applicationLink: z.string().url().optional(),
  questions: z.array(QuestionSchema).optional(),
});

export type QuestionInput = z.infer<typeof QuestionSchema>;
export type ApplicationInput = z.infer<typeof ApplicationSchema>;

export type Application = {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  location: string | null;
  applicationLink: string | null;
  status: string;
  dateApplied: Date;
  questions: QuestionInput[];
};
