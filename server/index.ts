import { protectedProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/drizzle/index";
import { UserTable } from "@/drizzle/schema";
import { applicationRouter } from "./routers/application";

export const appRouter = router({
  application: applicationRouter,
  userList: protectedProcedure.query(async () => {
    const users = await db.select().from(UserTable);
    return users;
  }),
});

export type AppRouter = typeof appRouter;
