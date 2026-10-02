import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';
export const movements = sqliteTable('movements', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), type: text('type').notNull(), cents: integer('cents').notNull(), category: text('category').notNull(), note: text('note').notNull(), date: text('date').notNull(), created: text('created').notNull(),
}, t => [index('movements_owner_date').on(t.owner,t.date)]);
export const categories = sqliteTable('categories', {
 owner: text('owner').notNull(), type: text('type').notNull(),
 key: text('key').notNull(), name: text('name').notNull(), created: text('created').notNull(),
}, t => [primaryKey({columns:[t.owner,t.type,t.key]})]);
