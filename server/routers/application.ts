import { protectedProcedure, router } from "../trpc";
import { db } from "@/drizzle/index";
import { Applications, Question } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ApplicationSchema, Application } from "./types";

export const applicationRouter = router({
  // PROCEDURE: Add an application linked to an account into the database
  addApplication: protectedProcedure
    .input(ApplicationSchema)
    .mutation(async ({ ctx, input }) => {
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
      return { success: true, id: createdApplication.id };
    }),

  // PROCEDURE: Find applications created by the current logged in user.
  findApplications: protectedProcedure.query(async ({ ctx }) => {
    // Must explicitly define what you want to select when joining two tables.
    const apps = await db
      .select({
        id: Applications.id,
        companyName: Applications.companyName,
        roleTitle: Applications.roleTitle,
        location: Applications.location,
        applicationLink: Applications.applicationLink,
        dateApplied: Applications.dateApplied,
        status: Applications.status,
        questions: Question,
      })
      .from(Applications)
      .leftJoin(Question, eq(Applications.id, Question.applicationId))
      .where(eq(Applications.userId, ctx.userId));

    // Group applications with their respective questions
    const groupedApplications = apps.reduce(
      (applicationsArray, row) => {
        const appId = row.id; // Get current row's application id to group.

        // If application does not have a group of questions already, create one.
        if (!applicationsArray[appId]) {
          applicationsArray[appId] = {
            id: row.id,
            userId: ctx.userId,
            companyName: row.companyName,
            roleTitle: row.roleTitle,
            location: row.location,
            applicationLink: row.applicationLink,
            dateApplied: row.dateApplied,
            status: row.status,
            questions: [],
          };
        }

        // If this row has a question, add it to the application that it belongs into
        if (row.questions?.id) {
          applicationsArray[appId].questions.push({
            question: row.questions.question,
            answer: row.questions.answer,
          });
        }
        return applicationsArray;
      },
      {} as Record<string, Application>,
    );

    // Return applications grouped with their questions
    return Object.values(groupedApplications);
  }),
});
