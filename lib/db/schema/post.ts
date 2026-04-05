import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/lib/db/schema/auth";
export const posts = pgTable("posts", {
    id: text('id').primaryKey().$default(  () => crypto.randomUUID()),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: text('author_id').notNull().references(() => user.id, {onDelete: 'cascade'}),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});