import {
  pgTable,
  varchar,
  uuid,
  uniqueIndex,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { UserRole, ApplicationStatus } from "./enums";

/*
Drizzle ORM database schema file. 
WARNING: Editing this file may result in changes within the database that can and will affect users!
*/

// UserTable(id, name, email, role)
export const UserTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    role: UserRole("role").default("BASIC"),
  },
  (t) => [uniqueIndex("emailIndex").on(t.email)],
);

// Applications(id, userId, companyName, roleTitle, location, applicationLink, dateApplied, status)
export const Applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  roleTitle: varchar("roleTitle", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  applicationLink: text("applicationLink"), //validate before storing links
  dateApplied: timestamp("dateApplied").defaultNow().notNull(),
  status: ApplicationStatus("status").default("Applied").notNull(),
});

// Question(id, applicationId, question, answer)
export const Question = pgTable("question", {
  id: uuid("questionId").primaryKey().defaultRandom(),
  applicationId: uuid("applicationId")
    .references(() => Applications.id, {
      onDelete: "cascade",
    })
    .notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});
