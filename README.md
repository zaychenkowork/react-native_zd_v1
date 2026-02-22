# React Native Template

Expo-based React Native template with TypeScript, file-based routing, and a scalable modular architecture.

## Tech Stack

| Category     | Technology                      |
| ------------ | ------------------------------- |
| Framework    | React Native 0.81 + Expo SDK 54 |
| Language     | TypeScript (strict mode)        |
| Navigation   | Expo Router (file-based)        |
| Server State | TanStack React Query v5         |
| Client State | Zustand v5                      |
| Validation   | Zod v4                          |
| HTTP Client  | Axios                           |
| Forms        | React Hook Form v7              |
| Storage      | MMKV                            |
| Animations   | Reanimated v4                   |
| Build        | EAS Build + local prebuild      |

## Quick Start

### Prerequisites

- Node.js >= 20 (see `.nvmrc`)
- Yarn
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- macOS: Xcode + CocoaPods (for iOS builds)
- Android Studio + JDK 17 (for Android builds)

### Installation

```bash
yarn install
```

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

| Variable                | Description                                  | Example                   |
| ----------------------- | -------------------------------------------- | ------------------------- |
| `EXPO_PUBLIC_RUN_MODE`  | App environment                              | `dev` / `stg` / `prod`    |
| `EXPO_PUBLIC_API_URL`   | API base URL                                 | `https://api.example.com` |
| `STRICT_ENV_VALIDATION` | Enable strict Zod validation before prebuild | `true` / `false`          |

## Running the App

### Development (Expo Go / Dev Client)

```bash
yarn start          # Start Metro dev server
```

### Native Build (Dev Client)

Requires prebuild to generate native projects first:

```bash
yarn prebuild        # Generate ios/ and android/ folders
yarn prebuild:clean  # Full regeneration from scratch (recommended)
```

Then run on device/emulator:

```bash
yarn ios             # Build and run on iOS Simulator
yarn android:setup   # (Android only) Create local.properties with SDK path
yarn android         # Build and run on Android Emulator
```

After the first native build, `yarn start` will use the dev client automatically — no need to rebuild unless you change native dependencies.

## Building for Release

### Local Builds

#### iOS (requires macOS + Xcode)

```bash
yarn ios:release     # Build Release .app for Simulator
```

For a signed `.ipa` (App Store / TestFlight):

1. Open `ios/` folder in Xcode
2. **Product → Archive**
3. **Distribute App** → choose destination

#### Android

If you get "SDK location not found", run `yarn android:setup` first.

```bash
yarn android:setup         # Create local.properties with SDK path (if needed)
yarn android:release       # Build .apk (for direct install / testing)
yarn android:release:aab   # Build .aab (for Google Play)
```

Output locations:

| Format | Path                                        |
| ------ | ------------------------------------------- |
| `.apk` | `android/app/build/outputs/apk/release/`    |
| `.aab` | `android/app/build/outputs/bundle/release/` |

> For production Android builds, you need a signing keystore. See [Android signing docs](https://developer.android.com/studio/publish/app-signing).

### EAS Build (Cloud)

EAS Build compiles native projects in the cloud — no local Xcode or Android SDK required for iOS/Android builds.

#### Initial Setup (one time)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to your Expo account
eas login
```

Before initializing, update `app.config.ts` with your real values:

- `EXPO_ACCOUNT_OWNER` — your Expo account username
- `EAS_PROJECT_ID` — your Expo project ID

```bash
# 3. Initialize the project (links to Expo servers)
eas init
```

#### Build Profiles

Configured in `eas.json`:

| Profile                 | Purpose                       | Env    | Distribution |
| ----------------------- | ----------------------------- | ------ | ------------ |
| `development`           | Dev client on physical device | `dev`  | internal     |
| `development-simulator` | Dev client on iOS Simulator   | `dev`  | internal     |
| `preview`               | Staging build for testers     | `stg`  | internal     |
| `production`            | Release build for app stores  | `prod` | store        |

#### Build Commands

```bash
# Development builds
yarn eas:dev:ios            # Dev client → physical iPhone
yarn eas:dev:android        # Dev client → physical Android
yarn eas:dev:simulator      # Dev client → iOS Simulator

# Preview / Staging builds
yarn eas:preview:ios        # Staging build → iOS (internal)
yarn eas:preview:android    # Staging build → Android .apk (internal)

# Production builds
yarn eas:prod:ios           # Production → iOS .ipa
yarn eas:prod:android       # Production → Android .aab
```

#### Publishing to Stores

##### Build + auto-submit

```bash
yarn eas:prod:ios:submit       # Build iOS + upload to App Store Connect
yarn eas:prod:android:submit   # Build Android + upload to Google Play
```

##### Store Requirements

## Project Structure

```
src/
├── api/            # Axios instance and API methods
├── app/            # Expo Router — thin route files only
├── config/         # App config (env values, query defaults)
├── constants/      # Shared constants (storage keys, etc.)
├── features/       # Business features (screens, feature components, local hooks)
├── hooks/          # Global custom hooks
│   ├── app/        # App lifecycle hooks (ready, focus, online)
│   └── query/      # React Query hooks (fetch, mutate)
├── utils/          # Utilities (storage, env validation, adapters)
├── providers/      # React context providers
├── schemas/        # Zod schemas for runtime validation
├── store/          # Zustand stores (client state)
├── types/          # Global TypeScript types, enums, API contracts
└── ui/
    ├── assets/     # Icons (SVG), images, fonts
    └── components/ # Reusable atomic UI components
```

### Features (`src/features/`)

Each feature is a self-contained module with screens, components, and optional local hooks. Route files in `src/app/` stay thin — they only import and re-export screen components from features. See `src/features/README.md` for full conventions.

```
features/posts/
├── screens/            # Screen components (entry points)
│   └── PostsScreen/
├── components/         # Feature-specific UI components
│   └── PostCard/
├── hooks/              # (optional) Feature-local hooks
├── types.ts            # (optional) Shared feature types
└── index.ts
```

### Component Structure

Every component (in `features/`, `ui/components/`, anywhere) is a **folder**:

```
ComponentName/
├── ComponentName.tsx
├── types.ts            # Props, local enums (or ComponentName.types.ts)
└── index.ts            # Barrel re-export
```

Types are always extracted into a separate file next to the component, never inline.

### State Management

| What                                       | Where           |
| ------------------------------------------ | --------------- |
| Server data (API responses, cache)         | React Query     |
| Client state (UI, auth token, preferences) | Zustand         |
| Form state                                 | React Hook Form |
| Persistent storage                         | MMKV            |

### SVG Icons

SVGs are imported as React components via `react-native-svg-transformer`. Use the `<Icon>` component with the icon registry in `src/ui/assets/icons/`.

## Code Quality & Git Hooks

### Pre-commit (husky + lint-staged)

On every `git commit`, staged files are automatically processed:

| File pattern  | Actions                             |
| ------------- | ----------------------------------- |
| `*.{ts,tsx}`  | `eslint --fix` → `prettier --write` |
| `*.{js,jsx}`  | `eslint --fix` → `prettier --write` |
| `*.{json,md}` | `prettier --write`                  |

If ESLint finds errors it can't auto-fix, the commit is blocked.

Config: `.lintstagedrc.json`

### Commit Message (commitlint)

All commit messages must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(optional scope): <description>
```

Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `build`, `ci`, `revert`

```bash
# ✅ Good
feat(auth): add sign in with Apple
fix(api): handle 401 on token refresh
chore: update dependencies

# ❌ Bad
added new screen        # no type
feat: Added new screen. # past tense + period
```

Header max length: **150 characters**. Config: `commitlint.config.js`

## Conventions

| Rule                        | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| Thin route files            | `app/` only imports screens from `features/` — no logic            |
| Component = folder          | Every component is a folder with `.tsx`, `types.ts`, `index.ts`    |
| Types next to component     | Props and local enums in `types.ts` beside the component           |
| One store per file          | `use[Name]Store.ts` — see `src/store/README.md`                    |
| One query hook per resource | `use[Resource]Query.ts` — see `src/hooks/query/README.md`          |
| Re-export from index        | Every folder has an `index.ts` barrel file                         |
| Selectors only              | Never subscribe to the whole Zustand store                         |
| Typed routes                | All routes are type-safe via Expo Router                           |
| Feature-local hooks         | Keep in `features/[name]/hooks/`; move to `src/hooks/` when reused |

### Types Location

| Scope                             | Location                                          |
| --------------------------------- | ------------------------------------------------- |
| Global (API contracts, enums)     | `src/types/`                                      |
| Component props, local enums      | `types.ts` or `[Name].types.ts` next to component |
| Shared between feature components | `features/[name]/types.ts`                        |

### Accessibility

All interactive and semantic elements can include accessibility props. Use i18n keys for labels so screen readers work in every supported language.

| Prop                 | When to use                                                                | Example                                     |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| `accessibilityRole`  | Every interactive or semantic element                                      | `"button"`, `"header"`, `"alert"`, `"link"` |
| `accessibilityLabel` | Buttons / icons without visible text, or when visible text is insufficient | `accessibilityLabel={t('auth.signIn')}`     |
| `accessibilityHint`  | When the action result isn't obvious from the label                        | `"Navigates to settings screen"`            |

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={t('auth.signIn')}
  onPress={handleSignIn}
>
  <Text>…</Text>
</Pressable>
```

### Environment Validation

Environment variables are validated at build time via Zod schema (`src/schemas/env.ts`). Direct access to `process.env` is blocked by an ESLint rule — use `Env` from `env.ts` (for `app.config.ts`) or `CONFIG` from `@/config` (for app code) instead.

## All Scripts Reference

| Script                         | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `yarn start`                   | Start Metro dev server                          |
| `yarn lint`                    | Run ESLint                                      |
| `yarn prebuild`                | Generate native ios/ and android/ folders       |
| `yarn prebuild:clean`          | Clean regeneration of native folders            |
| `yarn android:setup`           | Create android/local.properties with SDK path   |
| `yarn ios`                     | Build and run on iOS Simulator (debug)          |
| `yarn android`                 | Build and run on Android (debug)                |
| `yarn ios:release`             | Local iOS release build                         |
| `yarn android:release`         | Local Android release .apk                      |
| `yarn android:release:aab`     | Local Android release .aab (Google Play)        |
| `yarn eas:dev:ios`             | EAS: dev client → iOS device                    |
| `yarn eas:dev:android`         | EAS: dev client → Android device                |
| `yarn eas:dev:simulator`       | EAS: dev client → iOS Simulator                 |
| `yarn eas:preview:ios`         | EAS: staging → iOS (internal)                   |
| `yarn eas:preview:android`     | EAS: staging → Android .apk (internal)          |
| `yarn eas:prod:ios`            | EAS: production → iOS .ipa                      |
| `yarn eas:prod:android`        | EAS: production → Android .aab                  |
| `yarn eas:prod:ios:submit`     | EAS: production iOS + submit to App Store       |
| `yarn eas:prod:android:submit` | EAS: production Android + submit to Google Play |
