import { protectedProcedure, router } from "../trpc";
import { db } from "@/drizzle/index";
import { Applications } from "@/drizzle/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const applicationSchema = z.object({
  companyName: z.string().max(255),
  roleTitle: z.string().max(255),
  location: z.string().max(255).optional(),
  applicationLink: z.string().url().optional(),
});

export type ApplicationType = z.infer<typeof applicationSchema>;

export const applicationRouter = router({
  addApplication: protectedProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }: { ctx: any; input: ApplicationType }) => {
      if (!ctx.userId) {
        throw new Error("User ID is required");
      }
      await db.insert(Applications).values({
        ...input,
        userId: ctx.userId,
      });
      return { success: true };
    }),
  findApplications: protectedProcedure.query(async ({ ctx }) => {
    const allApps = await db
      .select()
      .from(Applications)
      .where(eq(Applications.userId, ctx.userId));
    return allApps;
  }),
});
