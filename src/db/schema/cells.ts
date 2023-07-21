import {real, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from "zod";

export const cells = sqliteTable("cells", {
    name: text("name").unique().notNull(),
    doublingTime: real("doubling_time").notNull(),
    maxConfluence: real("max_confluence"),
});

export const insertCellSchema = createInsertSchema(cells);
export type InsertCellSchema = z.infer<typeof insertCellSchema>;
export const selectCellSchema = createSelectSchema(cells);
export type SelectCellSchema = z.infer<typeof selectCellSchema>;

// This removes nullable types because the test doesn't want `null` values to be returned. In a bigger project I'd argue we should return `null`.
export const selectCellSchemaRequired = selectCellSchema.pick({name: true, doublingTime: true});