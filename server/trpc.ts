import { initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";

// creates a TRPC instance
// DO NOT EDIT
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  const { userId } = ctx.auth;
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
