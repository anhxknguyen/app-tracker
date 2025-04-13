import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/drizzle";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // Fetch webhook information
    const evt = await verifyWebhook(req);
    const { type, data } = evt;

    // Add new user to database when a user is created.
    if (type === "user.created") {
      const userId = data.id;
      const name = data.first_name ?? "Unknown";
      const email = data.email_addresses[0]?.email_address;

      if (!email) {
        return new Response("No email provided", { status: 400 });
      }
      await db.insert(UserTable).values({
        id: userId,
        name,
        email,
        role: "BASIC",
      });
    }

    // Delete user from database if the user is deleted.
    if (type === "user.deleted") {
      const userId = data.id;
      if (!userId) {
        return new Response("User ID is undefined", { status: 400 });
      }
      await db.delete(UserTable).where(eq(UserTable.id, userId));
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    // Catch webhook fetching failures
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
