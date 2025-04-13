import "dotenv/config";
import { defineConfig } from "drizzle-kit";

//Config file for Drizzle ORM
//DO NOT EDIT!
export default defineConfig({
  out: "./drizzle",
  schema: ["./drizzle/schema.ts", "./drizzle/enums.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
