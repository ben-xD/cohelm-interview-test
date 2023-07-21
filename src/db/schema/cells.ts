import {integer, real, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from "zod";

export const cells = sqliteTable("cells", {
    id: integer("id").primaryKey().notNull(),
    name: text("name").unique().notNull(),
    doublingTime: real("doubling_time").notNull(),
    maxConfluence: real("max_confluence").notNull(),
});

export const insertCellSchema = createInsertSchema(cells).pick({id: false});
export type InsertCellSchema = z.infer<typeof insertCellSchema>;
export const selectCellSchema = createSelectSchema(cells);
export type SelectCellSchema = z.infer<typeof selectCellSchema>;
