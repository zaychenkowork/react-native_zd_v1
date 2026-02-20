# Schemas

Zod schemas for runtime validation and type inference. Used for env validation (`env.ts`), API responses, and form inputs.

## Conventions

| Rule | Description |
|------|-------------|
| One schema per domain | `[domain].ts` (e.g., `env.ts`, `user.ts`) |
| Re-export from index | All schemas go through `index.ts` |
| Infer types from schemas | `type Foo = z.infer<typeof fooSchema>` |

## Quick Example

```ts
import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;
```

## Folder Structure

```
src/schemas/
├── index.ts
├── env.ts
└── README.md
```

## Docs

- [Zod v4](https://zod.dev/)
