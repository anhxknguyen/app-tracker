import { protectedProcedure, router } from "../trpc";
import { db } from "@/drizzle/index";
import { Applications, Question } from "@/drizzle/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const applicationSchema = z.object({
  companyName: z.string().max(255),
  roleTitle: z.string().max(255),
  location: z.string().max(255).optional(),
  applicationLink: z.string().url().optional(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
});

export type ApplicationType = z.infer<typeof applicationSchema>;

export const applicationRouter = router({
  addApplication: protectedProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }: { ctx: any; input: ApplicationType }) => {
      if (!ctx.userId) {
        throw new Error("User ID is required");
      }

      // Insert application without questions and return the id
      const [createdApplication] = await db
        .insert(Applications)
        .values({
          ...input,
          userId: ctx.userId,
        })
        .returning({ id: Applications.id });

      // Insert questions and link them to applications
      if (input.questions && input.questions.length > 0) {
        await db.insert(Question).values(
          input.questions.map((q) => ({
            applicationId: createdApplication.id,
            question: q.question,
            answer: q.answer,
          })),
        );
      }
      return { success: true };
    }),
  findApplications: protectedProcedure.query(async ({ ctx }) => {
    // Must explicitly define what you want to select when joining
    const apps = await db
      .select({
        id: Applications.id,
        companyName: Applications.companyName,
        roleTitle: Applications.roleTitle,
        location: Applications.location,
        applicationLink: Applications.applicationLink,
        status: Applications.status,
        questions: Question,
      })
      .from(Applications)
      .leftJoin(Question, eq(Applications.id, Question.applicationId))
      .where(eq(Applications.userId, ctx.userId));

    // Group applications with their respective questions
    const grouped = apps.reduce(
      (acc, row) => {
        const appId = row.id;

        // If application does not have a group of questions already, create one.
        if (!acc[appId]) {
          acc[appId] = {
            id: row.id,
            companyName: row.companyName,
            roleTitle: row.roleTitle,
            location: row.location,
            applicationLink: row.applicationLink,
            status: row.status,
            questions: [],
          };
        }

        // If this row has a question, add it to the application that it belongs into
        if (row.questions?.id) {
          acc[appId].questions.push({
            question: row.questions.question,
            answer: row.questions.answer,
          });
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // Return applications grouped with their questions
    return Object.values(grouped);
  }),
});
