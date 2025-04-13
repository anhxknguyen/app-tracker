import { pgEnum } from "drizzle-orm/pg-core";
/*
All database schema related Enums
*/
export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"]);
export const ApplicationStatus = pgEnum("applicationStatus", [
  "Applied",
  "Ongoing",
  "Accepted",
  "Rejected",
]);
