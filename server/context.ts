import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle";

export async function createTRPCContext() {
  const { userId } = await auth();

  return {
    db,
    userId,
  };
}
