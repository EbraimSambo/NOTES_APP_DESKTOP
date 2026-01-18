import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {v7 as uuid} from "uuid"

export const notesTable = sqliteTable("notes", {
  id: text().$default(() => uuid()).notNull(),
  orderId: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text().notNull(),
  color: text(),
  isPinned: text().notNull().default("false"),
  createdAt: text().notNull().$default(() => new Date().toISOString()),
  updatedAt: text().notNull().$default(() => new Date().toISOString()),
});

export const tagsTable = sqliteTable("tags", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
});

export const noteRelations =  relations(notesTable, ({ many }) => ({
  tags: many(tagsTable),
}));