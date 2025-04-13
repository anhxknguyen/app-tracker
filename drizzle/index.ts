import "dotenv/config";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

// Initializes DB. DO NOT EDIT.
export const db = drizzle(process.env.DATABASE_URL!, { schema, logger: true });
