# Schemas

Zod schemas for runtime validation and type inference. Used for env validation (`env.ts`), API responses, and form inputs.

## Conventions

| Rule                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| One schema per domain    | `[domain].ts` (e.g., `env.ts`, `user.ts`)     |
| Direct imports           | Import schemas from their module — no barrels |
| Infer types from schemas | `type Foo = z.infer<typeof fooSchema>`        |

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
└── env.ts
```

## Using Schemas with Forms

Schemas double as form validators via `zodResolver` from `@hookform/resolvers/zod`.

> Zod v4 is officially supported by `@hookform/resolvers` since v5.1.0 — no custom resolver is needed.

### Step 1 — Define the schema in `src/schemas/`

```ts
// src/schemas/signIn.ts
import z from 'zod';

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8, { message: 'validation.passwordMin' }),
});

export type SignInFields = z.infer<typeof signInSchema>;
```

### Step 2 — Wire up the form in the screen

```tsx
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';

import { type SignInFields, signInSchema } from '@/schemas/signIn';

export function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFields) => {
    // data is fully typed and validated
  };

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput onChangeText={onChange} value={value} />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)} title="Sign In" />
    </>
  );
}
```

## Docs

- [Zod v4](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
