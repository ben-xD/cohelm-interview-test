import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const utilizationReviewTable = sqliteTable("utilization_review", {
  id: text("id").primaryKey().unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  // Would usually be a foreign key that references usersTable.id
  patientId: text("patient_id").notNull(),
  guidelines: text("guidelines").notNull(),
  review: text("output"),
});

export const insertUtilizationReviewSchema = createInsertSchema(
  utilizationReviewTable
);
export type InsertUtilizationReviewSchema = z.infer<
  typeof insertUtilizationReviewSchema
>;
export const selectUtilizationReviewSchema = createSelectSchema(
  utilizationReviewTable
);
export type SelectUtilizationReviewSchema = z.infer<
  typeof selectUtilizationReviewSchema
>;

export const medicalRecordsTable = sqliteTable("medical_records", {
  id: text("id").primaryKey().unique().notNull().primaryKey(),
  patientId: text("patient_id").notNull(),
  originalFilename: text("original_filename"), // for better comms with customers
  uploadedAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const insertMedicalRecordsSchema =
  createInsertSchema(medicalRecordsTable);
export type InsertMedicalRecordsSchema = z.infer<
  typeof insertMedicalRecordsSchema
>;
export const selectMedicalRecordsSchema =
  createSelectSchema(medicalRecordsTable);
export type SelectMedicalRecordsSchema = z.infer<
  typeof selectMedicalRecordsSchema
>;

// export const utilizationReviewEvidenceTable = sqliteTable(
//   "utilization_review_evidence",
//   {
//     criteria: text("criteria").unique().notNull(),
//     utilizationReviewId: text("utilization_review_id")
//       .notNull()
//       .references(() => utilizationReviewTable.id),
//     score: integer("score").notNull(),
//     evidence: text("evidence").notNull(),
//     reasoning: text("reasoning").notNull(),
//     page: integer("page").notNull(),
//   }
// );
