# CLAUDE.md

Production-grade Expo SDK 56 / React Native 0.85 template — file-based routing (Expo Router), Unistyles v3 styling, React Query v5 server state, Zustand v5 client state, Zod v4 schemas, React Hook Form, MMKV storage, SecureStore for tokens, i18next localization, Sentry error tracking.

> Node >= 22. Uses a Dev Client — **Expo Go will not work** (MMKV, Unistyles v3, Reanimated, Sentry require native modules).

---

## Key Commands

| Command                    | What it does                                                      |
| -------------------------- | ----------------------------------------------------------------- |
| `yarn start`               | Start Metro dev server (connects to Dev Client)                   |
| `yarn lint`                | Run ESLint                                                        |
| `yarn type-check`          | TypeScript check, no emit                                         |
| `yarn test`                | Run Jest tests                                                    |
| `yarn test:watch`          | Jest in watch mode                                                |
| `yarn test:coverage`       | Jest with coverage report                                         |
| `yarn e2e`                 | Maestro E2E smoke flow (needs Maestro CLI + a running Dev Client) |
| `yarn format`              | Prettier over `*.ts/tsx` in `src/` and `__tests__/`               |
| `yarn prebuild`            | Generate `ios/` and `android/` from config                        |
| `yarn prebuild:clean`      | Full clean regeneration of native folders                         |
| `yarn ios`                 | Build and run on iOS Simulator                                    |
| `yarn android`             | Build and run on Android Emulator                                 |
| `yarn android:setup`       | Create `android/local.properties` (first-time Android setup)      |
| `yarn eas:dev:ios`         | EAS dev client build for iOS device                               |
| `yarn eas:dev:android`     | EAS dev client build for Android device                           |
| `yarn eas:dev:simulator`   | EAS dev client build for iOS Simulator                            |
| `yarn eas:preview:ios`     | EAS staging build for iOS                                         |
| `yarn eas:preview:android` | EAS staging build for Android                                     |
| `yarn eas:prod:ios`        | EAS production build for iOS                                      |
| `yarn eas:prod:android`    | EAS production build for Android                                  |

---

## Architecture Conventions

### Route files stay thin

`src/app/` files contain **only** a default export that re-exports a screen from `src/features/`:

```tsx
// src/app/(app)/posts/index.tsx
import { PostsScreen } from '@/features/posts/screens/PostsScreen';
export default PostsScreen;
```

No logic, no hooks, no JSX in route files.

### Feature module layout

```
src/features/[name]/
├── screens/[Name]Screen.tsx   # Screen entry points
├── components/[Name].tsx      # Feature-specific UI
├── hooks/                     # (optional) feature-local hooks
└── types.ts                   # (optional) shared feature types
```

Feature-local hooks live in `features/[name]/hooks/`; promote to `src/hooks/` only when reused across features.

### Component = flat file

Every component (in features, ui/components, anywhere) is a single `.tsx` file named after the component. Export the props type from the same file:

```tsx
// src/ui/components/ComponentName.tsx
export type ComponentNameProps = { ... };
export function ComponentName(props: ComponentNameProps) { ... }
```

### No barrel files

Never create `index.ts` re-export barrels; always import from the concrete module (`@/store/useAuthStore`, `@/ui/components/Icon`). Barrels hurt Metro bundling/resolution and fast refresh — see [TkDodo](https://tkdodo.eu/blog/please-stop-using-barrel-files), [Marvin Hagemeister](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/), [Ignite v11 release notes](https://github.com/infinitered/ignite/releases/tag/v11.0.0), [Obytes starter](https://starter.obytes.com/getting-started/project-structure/). ESLint bans `export * from` as a guard.

### Types location

| Scope                              | Location                         |
| ---------------------------------- | -------------------------------- |
| Global API contracts, shared enums | `src/types/`                     |
| Component props, local enums       | `types.ts` next to the component |
| Shared between feature components  | `features/[name]/types.ts`       |

### Styling — Unistyles v3 only

Never use `StyleSheet` from `react-native`. Use `StyleSheet` from `react-native-unistyles`:

```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing(4),
  },
}));
```

Colors, spacing, and radius always come from `theme.*` — never hardcoded. Theme config lives in `src/ui/theme/` (`colors.ts`, `fonts.ts`, `metrics.ts`, `unistyles.ts`).

### Zustand — selectors only

Never subscribe to the whole store. Always use a selector:

```ts
const token = useAuthStore((s) => s.accessToken); // single field
const { accessToken, signOut } = useAuthStore(
  useShallow((s) => ({ accessToken: s.accessToken, signOut: s.signOut })),
); // multiple fields
```

One store per file: `use[Name]Store.ts` in `src/store/`.

### React Query — one hook per resource

Hook files live in `src/hooks/query/`, named `use[Resource]Query.ts` or `use[Action]Mutation.ts`.
Always wrap API calls with `fetcher()` from `@/api/fetcher` to unwrap `AxiosResponse<T>` → `T`:

```ts
import { api } from '@/api/client';
import { fetcher } from '@/api/fetcher';
queryFn: () => fetcher(api.getUser(id));
```

### Environment access

- **App code**: import `CONFIG` from `@/config/config` — never `process.env`
- **`app.config.ts` / `env.ts` only**: import `Env` from `env.ts`
- `process.env` is blocked everywhere else by an ESLint rule (`no-restricted-syntax`)

### Token storage

Auth tokens (access + refresh) live in **SecureStore** (iOS Keychain / Android Keystore) via `@/utils/secureToken`. MMKV is for non-sensitive persistence (theme, language, UI prefs).

### Forms

Use `zodResolver` from `@hookform/resolvers/zod` (Zod v4 is officially supported since v5.1.0). Define schemas in `src/schemas/`, infer types with `z.infer<>`.

### Imports order (ESLint-enforced)

`simple-import-sort` enforces: side effects → node builtins → external packages → `@/ui` → `@/hooks` → `@/providers` → `@/utils` → `@/api` → `@/store` → `@/types` → `@/constants` → `@/schemas` → `@/config` → `@/` other → relative.

---

## Testing

Jest 29 (pinned by `jest-expo`) + React Native Testing Library v14. Tests live under `__tests__/`, mirroring `src/` structure. RNTL v14 APIs are async — `await render(...)`, `await fireEvent.press(...)`.

**Required:** every `src/utils/` function and every `src/ui/components/` component must have a test.

**Recommended (not required):** critical screens (auth, onboarding, checkout), non-trivial Zustand stores.

**Not tested:** Zod schemas, React Query hooks, route files, theme/config.

Use `render` from `@tests/test-utils` (not from RNTL directly) — it wraps with QueryClient and other providers. Query by role/text, not by `testId`. Test name pattern: _what + when + expected result_.

Full conventions: `src/docs/testing.md`

**E2E:** a Maestro smoke flow lives in `.maestro/` — run with `yarn e2e` (requires the Maestro CLI and a running Dev Client). See `src/docs/e2e.md`.

---

## Commit Messages

Conventional Commits 1.0.0. Header max **150 characters**. Lowercase, imperative, no trailing period.
Types: `feat` `fix` `chore` `refactor` `docs` `style` `test` `perf` `build` `ci` `revert`

```
feat(auth): add sign in with Apple
fix(api): handle 401 on token refresh
```

Full rule: `.cursor/rules/conventional-commits.mdc`

---

## Git Hooks (husky)

- **pre-commit** (lint-staged): ESLint --fix + Prettier on staged `*.ts/tsx/js/jsx/json/md`
- **pre-push**: `yarn type-check && yarn test` — both must pass before push

---

## Reference Docs

| File                                     | What it covers                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/docs/features.md`                   | Feature module structure and conventions                                               |
| `src/docs/api.md`                        | Axios instance, `fetcher()`, JWT refresh interceptor pattern                           |
| `src/docs/hooks-query.md`                | React Query hook conventions, `fetcher()` usage, query key enums                       |
| `src/docs/store.md`                      | Zustand store conventions, `useShallow` for multi-field selectors                      |
| `src/docs/schemas.md`                    | Zod schema conventions, `zodResolver` for RHF                                          |
| `src/docs/ui-components.md`              | UI component workflow: primitives vs components, Unistyles v3                          |
| `src/docs/testing.md`                    | Full testing conventions, folder structure, examples                                   |
| `src/docs/e2e.md`                        | Maestro E2E setup and how to run the smoke flow                                        |
| `src/docs/deep-linking.md`               | Deep linking setup (placeholder — fill in when domain is set)                          |
| `.cursor/rules/rn-primitives.mdc`        | Step-by-step AI workflow for adding UI components (rn-primitives + rnr → Unistyles v3) |
| `.cursor/rules/conventional-commits.mdc` | Commit message format reference                                                        |
