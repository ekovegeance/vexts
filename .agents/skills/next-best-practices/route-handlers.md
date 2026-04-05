# Route Handlers

Create API endpoints with `route.ts` files.

## Basic Usage

```tsx
// app/api/auth/route.ts
export async function GET() {
  const auth = await getUsers()
  return Response.json(auth)
}

export async function POST(request: Request) {
  const body = await request.json()
  const auth = await createUser(body)
  return Response.json(auth, { status: 201 })
}
```

## Supported Methods

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

## GET Handler Conflicts with page.tsx

**A `route.ts` and `page.tsx` cannot coexist in the same folder.**

```
app/
├── api/
│   └── auth/
│       └── route.ts    # /api/auth
└── auth/
    ├── page.tsx        # /auth (page)
    └── route.ts        # Warning: Conflicts with page.tsx!
```

If you need both a page and an API at the same path, use different paths:

```
app/
├── auth/
│   └── page.tsx        # /auth (page)
└── api/
    └── auth/
        └── route.ts    # /api/auth (API)
```

## Environment Behavior

Route handlers run in a **Server Component-like environment**:

- Yes: Can use `async/await`
- Yes: Can access `cookies()`, `headers()`
- Yes: Can use Node.js APIs
- No: Cannot use React hooks
- No: Cannot use React DOM APIs
- No: Cannot use browser APIs

```tsx
// Bad: This won't work - no React DOM in route handlers
import { renderToString } from 'react-dom/server'

export async function GET() {
  const html = renderToString(<Component />)  // Error!
  return new Response(html)
}
```

## Dynamic Route Handlers

```tsx
// app/api/auth/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getUser(id)

  if (!auth) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(auth)
}
```

## Request Helpers

```tsx
export async function GET(request: Request) {
  // URL and search params
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Headers
  const authHeader = request.headers.get('authorization')

  // Cookies (Next.js helper)
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return Response.json({ query, token })
}
```

## Response Helpers

```tsx
// JSON response
return Response.json({ data })

// With status
return Response.json({ error: 'Not found' }, { status: 404 })

// With headers
return Response.json(data, {
  headers: {
    'Cache-Control': 'max-age=3600',
  },
})

// Redirect
return Response.redirect(new URL('/login', request.url))

// Stream
return new Response(stream, {
  headers: { 'Content-Type': 'text/event-stream' },
})
```

## When to Use Route Handlers vs Server Actions

| Use Case | Route Handlers | Server Actions |
|----------|----------------|----------------|
| Form submissions | No | Yes |
| Data mutations from UI | No | Yes |
| Third-party webhooks | Yes | No |
| External API consumption | Yes | No |
| Public REST API | Yes | No |
| File uploads | Both work | Both work |

**Prefer Server Actions** for mutations triggered from your UI.
**Use Route Handlers** for external integrations and public APIs.
