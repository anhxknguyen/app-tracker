import { publicProcedure, router } from "./trpc";
import { db } from "@/drizzle/index";
import { UserTable } from "@/drizzle/schema";
import { z } from "zod";

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.select().from(UserTable);
    return users;
  }),
  userCreate: publicProcedure.input(z.string()).mutation(async (opts) => {
    const { input } = opts;
    return;
  }),
});

export type AppRouter = typeof appRouter;
