import { initTRPC } from "@trpc/server";

// creates a TRPC instance
// DO NOT EDIT
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
