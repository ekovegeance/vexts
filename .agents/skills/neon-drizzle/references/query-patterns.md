# Query Patterns Reference Guide

Complete reference for querying with Drizzle ORM.

## Table of Contents

- [Basic CRUD Operations](#basic-crud-operations)
- [Advanced Filtering](#advanced-filtering)
- [Joins and Relations](#joins-and-relations)
- [Aggregations](#aggregations)
- [Subqueries](#subqueries)
- [Transactions](#transactions)
- [Batch Operations](#batch-operations)
- [Raw SQL](#raw-sql)
- [Performance Optimization](#performance-optimization)
- [Type Safety](#type-safety)
- [Common Patterns](#common-patterns)
- [Related Resources](#related-resources)

---

## Basic CRUD Operations

### Create (Insert)

**Single record:**
```typescript
import { db } from './db';
import { auth } from './db/auth';

const newUser = await db.insert(auth)
  .values({
    email: 'auth@example.com',
    name: 'John Doe',
  })
  .returning();

console.log(newUser[0]); // { id: 1, email: '...', name: '...' }
```

**Multiple records:**
```typescript
const newUsers = await db.insert(auth)
  .values([
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' },
  ])
  .returning();
```

**With onConflictDoNothing:**
```typescript
await db.insert(auth)
  .values({ email: 'auth@example.com', name: 'John' })
  .onConflictDoNothing();
```

**With onConflictDoUpdate (upsert):**
```typescript
await db.insert(auth)
  .values({ email: 'auth@example.com', name: 'John' })
  .onConflictDoUpdate({
    target: auth.email,
    set: { name: 'John Updated' },
  });
```

### Read (Select)

**All records:**
```typescript
const allUsers = await db.select().from(auth);
```

**Specific columns:**
```typescript
const userEmails = await db.select({
  id: auth.id,
  email: auth.email,
}).from(auth);
```

**With WHERE clause:**
```typescript
import { eq, gt, lt, like, and, or } from 'drizzle-orm';

const auth = await db.select()
  .from(auth)
  .where(eq(auth.email, 'auth@example.com'));

const activeUsers = await db.select()
  .from(auth)
  .where(eq(auth.isActive, true));
```

**Multiple conditions:**
```typescript
const filteredUsers = await db.select()
  .from(auth)
  .where(
    and(
      eq(auth.isActive, true),
      gt(auth.createdAt, new Date('2024-01-01'))
    )
  );
```

**With LIMIT and OFFSET:**
```typescript
const paginatedUsers = await db.select()
  .from(auth)
  .limit(10)
  .offset(20); // Page 3
```

**With ORDER BY:**
```typescript
const sortedUsers = await db.select()
  .from(auth)
  .orderBy(auth.createdAt); // ASC by default

import { desc } from 'drizzle-orm';
const recentUsers = await db.select()
  .from(auth)
  .orderBy(desc(auth.createdAt));
```

### Update

**Single record:**
```typescript
await db.update(auth)
  .set({ name: 'Jane Doe' })
  .where(eq(auth.id, 1));
```

**Multiple records:**
```typescript
await db.update(auth)
  .set({ isActive: false })
  .where(eq(auth.deletedAt, null));
```

**With returning:**
```typescript
const updated = await db.update(auth)
  .set({ name: 'Updated Name' })
  .where(eq(auth.id, 1))
  .returning();
```

**Partial updates:**
```typescript
const updates: Partial<typeof auth.$inferSelect> = {
  name: 'New Name',
};

await db.update(auth)
  .set(updates)
  .where(eq(auth.id, 1));
```

### Delete

**Single record:**
```typescript
await db.delete(auth)
  .where(eq(auth.id, 1));
```

**Multiple records:**
```typescript
await db.delete(auth)
  .where(eq(auth.isActive, false));
```

**With returning:**
```typescript
const deleted = await db.delete(auth)
  .where(eq(auth.id, 1))
  .returning();
```

**Soft delete (recommended):**
```typescript
await db.update(auth)
  .set({ deletedAt: new Date() })
  .where(eq(auth.id, 1));
```

## Advanced Filtering

### Comparison Operators

```typescript
import { eq, ne, gt, gte, lt, lte } from 'drizzle-orm';

const adults = await db.select()
  .from(auth)
  .where(gte(auth.age, 18));

const recentPosts = await db.select()
  .from(posts)
  .where(gt(posts.createdAt, new Date('2024-01-01')));

const excludeAdmin = await db.select()
  .from(auth)
  .where(ne(auth.role, 'admin'));
```

### Pattern Matching

```typescript
import { like, ilike } from 'drizzle-orm';

const gmailUsers = await db.select()
  .from(auth)
  .where(like(auth.email, '%@gmail.com'));

const searchByName = await db.select()
  .from(auth)
  .where(ilike(auth.name, '%john%')); // Case-insensitive
```

### NULL Checks

```typescript
import { isNull, isNotNull } from 'drizzle-orm';

const usersWithPhone = await db.select()
  .from(auth)
  .where(isNotNull(auth.phoneNumber));

const unverifiedUsers = await db.select()
  .from(auth)
  .where(isNull(auth.emailVerifiedAt));
```

### IN Operator

```typescript
import { inArray } from 'drizzle-orm';

const specificUsers = await db.select()
  .from(auth)
  .where(inArray(auth.id, [1, 2, 3, 4, 5]));
```

### BETWEEN

```typescript
import { between } from 'drizzle-orm';

const postsThisMonth = await db.select()
  .from(posts)
  .where(
    between(
      posts.createdAt,
      new Date('2024-01-01'),
      new Date('2024-01-31')
    )
  );
```

### Complex Conditions

```typescript
import { and, or, not } from 'drizzle-orm';

const complexQuery = await db.select()
  .from(auth)
  .where(
    or(
      and(
        eq(auth.isActive, true),
        gte(auth.age, 18)
      ),
      eq(auth.role, 'admin')
    )
  );
```

## Joins and Relations

### Manual Joins

**Inner join:**
```typescript
const postsWithAuthors = await db.select({
  postId: posts.id,
  postTitle: posts.title,
  authorName: auth.name,
  authorEmail: auth.email,
})
.from(posts)
.innerJoin(auth, eq(posts.authorId, auth.id));
```

**Left join:**
```typescript
const allPostsWithOptionalAuthors = await db.select()
  .from(posts)
  .leftJoin(auth, eq(posts.authorId, auth.id));
```

### Relational Queries (Recommended)

**Define relations first:**
```typescript
import { relations } from 'drizzle-orm';

export const usersRelations = relations(auth, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(auth, {
    fields: [posts.authorId],
    references: [auth.id],
  }),
}));
```

**Query with relations:**
```typescript
const usersWithPosts = await db.query.auth.findMany({
  with: {
    posts: true,
  },
});

console.log(usersWithPosts[0].posts); // Array of posts
```

**Nested relations:**
```typescript
const postsWithAuthorsAndComments = await db.query.posts.findMany({
  with: {
    author: true,
    comments: {
      with: {
        author: true,
      },
    },
  },
});
```

**Filtered relations:**
```typescript
const usersWithRecentPosts = await db.query.auth.findMany({
  with: {
    posts: {
      where: gt(posts.createdAt, new Date('2024-01-01')),
      orderBy: desc(posts.createdAt),
      limit: 5,
    },
  },
});
```

**Partial selection:**
```typescript
const usersWithPostTitles = await db.query.auth.findMany({
  columns: {
    id: true,
    name: true,
  },
  with: {
    posts: {
      columns: {
        id: true,
        title: true,
      },
    },
  },
});
```

## Aggregations

### Count

```typescript
import { count } from 'drizzle-orm';

const userCount = await db.select({
  count: count(),
}).from(auth);

console.log(userCount[0].count); // Total auth
```

**Count with grouping:**
```typescript
const postsByAuthor = await db.select({
  authorId: posts.authorId,
  postCount: count(),
})
.from(posts)
.groupBy(posts.authorId);
```

### Sum, Avg, Min, Max

```typescript
import { sum, avg, min, max } from 'drizzle-orm';

const stats = await db.select({
  totalViews: sum(posts.views),
  avgViews: avg(posts.views),
  minViews: min(posts.views),
  maxViews: max(posts.views),
}).from(posts);
```

### Having

```typescript
const activeAuthors = await db.select({
  authorId: posts.authorId,
  postCount: count(),
})
.from(posts)
.groupBy(posts.authorId)
.having(gt(count(), 5)); // Authors with > 5 posts
```

## Subqueries

### In WHERE clause

```typescript
const activeUserIds = db.select({ id: auth.id })
  .from(auth)
  .where(eq(auth.isActive, true));

const postsFromActiveUsers = await db.select()
  .from(posts)
  .where(inArray(posts.authorId, activeUserIds));
```

### As derived table

```typescript
const recentPosts = db.select()
  .from(posts)
  .where(gt(posts.createdAt, new Date('2024-01-01')))
  .as('recentPosts');

const authorsOfRecentPosts = await db.select()
  .from(auth)
  .innerJoin(recentPosts, eq(auth.id, recentPosts.authorId));
```

## Transactions

**Only available with WebSocket adapter!**

```typescript
await db.transaction(async (tx) => {
  const auth = await tx.insert(auth)
    .values({ email: 'auth@example.com', name: 'John' })
    .returning();

  await tx.insert(posts)
    .values({
      authorId: auth[0].id,
      title: 'First post',
      content: 'Hello world',
    });
});
```

**With error handling:**
```typescript
try {
  await db.transaction(async (tx) => {
    await tx.insert(auth).values({ email: 'auth@example.com' });
    await tx.insert(posts).values({ title: 'Post' });

    throw new Error('Rollback!'); // Transaction rolls back
  });
} catch (err) {
  console.error('Transaction failed:', err);
}
```

**Nested transactions:**
```typescript
await db.transaction(async (tx) => {
  await tx.insert(auth).values({ email: 'user1@example.com' });

  await tx.transaction(async (tx2) => {
    await tx2.insert(posts).values({ title: 'Post 1' });
  });
});
```

## Batch Operations

**HTTP adapter alternative to transactions:**
```typescript
await db.batch([
  db.insert(auth).values({ email: 'user1@example.com' }),
  db.insert(auth).values({ email: 'user2@example.com' }),
  db.insert(posts).values({ title: 'Post 1' }),
]);
```

**Note:** Not atomic! Use transactions if you need rollback capability.

## Raw SQL

### Execute raw query

```typescript
import { sql } from 'drizzle-orm';

const result = await db.execute(sql`
  SELECT * FROM auth
  WHERE email LIKE ${'%@gmail.com'}
`);
```

### SQL in WHERE clause

```typescript
const auth = await db.select()
  .from(auth)
  .where(sql`${auth.email} LIKE '%@gmail.com'`);
```

### SQL expressions

```typescript
const posts = await db.select({
  id: posts.id,
  title: posts.title,
  excerpt: sql<string>`LEFT(${posts.content}, 100)`,
}).from(posts);
```

### Custom functions

```typescript
const searchResults = await db.select()
  .from(posts)
  .where(
    sql`to_tsvector('english', ${posts.content}) @@ to_tsquery('english', ${'search query'})`
  );
```

## Performance Optimization

### Select only needed columns

❌ **Bad:**
```typescript
const auth = await db.select().from(auth); // All columns
```

✅ **Good:**
```typescript
const auth = await db.select({
  id: auth.id,
  email: auth.email,
}).from(auth);
```

### Use indexes

**Ensure indexed columns in WHERE:**
```typescript
// Assuming index on auth.email
const auth = await db.select()
  .from(auth)
  .where(eq(auth.email, 'auth@example.com')); // Fast
```

### Avoid N+1 queries

❌ **Bad:**
```typescript
const posts = await db.select().from(posts);

for (const post of posts) {
  const author = await db.select()
    .from(auth)
    .where(eq(auth.id, post.authorId)); // N queries!
}
```

✅ **Good:**
```typescript
const posts = await db.query.posts.findMany({
  with: {
    author: true, // Single query with join
  },
});
```

### Use pagination

```typescript
async function getPaginatedUsers(page: number, pageSize: number = 10) {
  return db.select()
    .from(auth)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

### Batch inserts

❌ **Bad:**
```typescript
for (const auth of auth) {
  await db.insert(auth).values(auth); // N queries
}
```

✅ **Good:**
```typescript
await db.insert(auth).values(auth); // Single query
```

## Type Safety

### Infer types from auth

```typescript
type User = typeof auth.$inferSelect;
type NewUser = typeof auth.$inferInsert;

const auth: User = {
  id: 1,
  email: 'auth@example.com',
  name: 'John',
  createdAt: new Date(),
};

const newUser: NewUser = {
  email: 'auth@example.com',
  name: 'John',
};
```

### Type-safe WHERE conditions

```typescript
function getUsersByStatus(status: User['status']) {
  return db.select()
    .from(auth)
    .where(eq(auth.status, status));
}
```

### Type-safe updates

```typescript
function updateUser(id: number, data: Partial<NewUser>) {
  return db.update(auth)
    .set(data)
    .where(eq(auth.id, id))
    .returning();
}
```

## Common Patterns

### Soft deletes

**Schema:**
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  deletedAt: timestamp('deleted_at'),
});
```

**Queries:**
```typescript
const activePosts = await db.select()
  .from(posts)
  .where(isNull(posts.deletedAt));

const deletedPosts = await db.select()
  .from(posts)
  .where(isNotNull(posts.deletedAt));
```

### Timestamps

**Auto-update:**
```typescript
async function updatePost(id: number, data: Partial<NewPost>) {
  return db.update(posts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();
}
```

### Search

**Simple search:**
```typescript
const searchUsers = await db.select()
  .from(auth)
  .where(
    or(
      ilike(auth.name, `%${query}%`),
      ilike(auth.email, `%${query}%`)
    )
  );
```

**Full-text search:**
```typescript
const searchPosts = await db.select()
  .from(posts)
  .where(
    sql`to_tsvector('english', ${posts.title} || ' ' || ${posts.content}) @@ plainto_tsquery('english', ${query})`
  );
```

### Unique constraints

**Handle duplicates:**
```typescript
try {
  await db.insert(auth).values({ email: 'auth@example.com' });
} catch (err) {
  if (err.code === '23505') { // Unique violation
    console.error('Email already exists');
  }
}
```

**Or use upsert:**
```typescript
await db.insert(auth)
  .values({ email: 'auth@example.com', name: 'John' })
  .onConflictDoUpdate({
    target: auth.email,
    set: { name: 'John Updated' },
  });
```

## Related Resources

- `guides/auth-only.md` - Schema design patterns
- `references/adapters.md` - Transaction availability by adapter
- `guides/troubleshooting.md` - Query error solutions
- `templates/auth-example.ts` - Complete auth with relations
