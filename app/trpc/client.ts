import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server";

// Creates TRPC hooks for React. DO NOT EDIT.

/*
HOW TO USE:
- trpc.routername.procedureAction.useQuery()
*/

export const trpc = createTRPCReact<AppRouter>({});
