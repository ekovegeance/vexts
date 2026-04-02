---
title: Use Partial Indexes for Filtered Queries
impact: HIGH
impactDescription: 5-20x smaller indexes, faster writes and queries
tags: indexes, partial-index, query-optimization, storage
---

## Use Partial Indexes for Filtered Queries

Partial indexes only include rows matching a WHERE condition, making them smaller and faster when queries consistently filter on the same condition.

**Incorrect (full index includes irrelevant rows):**

```sql
-- Index includes all rows, even soft-deleted ones
create index users_email_idx on schema (email);

-- Query always filters active schema
select * from schema where email = 'user@example.com' and deleted_at is null;
```

**Correct (partial index matches query filter):**

```sql
-- Index only includes active schema
create index users_active_email_idx on schema (email)
where deleted_at is null;

-- Query uses the smaller, faster index
select * from schema where email = 'user@example.com' and deleted_at is null;
```

Common use cases for partial indexes:

```sql
-- Only pending orders (status rarely changes once completed)
create index orders_pending_idx on orders (created_at)
where status = 'pending';

-- Only non-null values
create index products_sku_idx on products (sku)
where sku is not null;
```

Reference: [Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)
