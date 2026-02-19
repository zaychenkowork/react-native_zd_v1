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

## Quick Start

### Prerequisites

- Node.js >= 18
- Yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
yarn install
```

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

### Run the App

```bash
yarn start        # Start Expo dev server
yarn ios          # Run on iOS Simulator
yarn android      # Run on Android Emulator
```

## Project Structure

```
src/
├── api/            # Axios instance and API methods
├── app/            # Expo Router screens and layouts
├── config/         # App config (env values, query defaults)
├── hooks/          # Custom hooks
│   └── query/      # React Query hooks (fetch, mutate)
├── lib/            # Utilities (storage, env validation)
├── providers/      # React context providers
├── schemas/        # Zod schemas for runtime validation
├── store/          # Zustand stores (client state)
├── types/          # TypeScript types, enums, API contracts
└── ui/
    ├── assets/     # Icons (SVG), images, fonts
    └── components/ # Reusable atomic components (Icon, Button)
```

### State Management

| What                                       | Where           |
| ------------------------------------------ | --------------- |
| Server data (API responses, cache)         | React Query     |
| Client state (UI, auth token, preferences) | Zustand         |
| Form state                                 | React Hook Form |
| Persistent storage                         | MMKV            |

### SVG Icons

SVGs are imported as React components via `react-native-svg-transformer`. Use the `<Icon>` component with the icon registry in `src/ui/assets/icons/`.

## Conventions

| Rule                        | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| One store per file          | `use[Name]Store.ts` — see `src/store/README.md`           |
| One query hook per resource | `use[Resource]Query.ts` — see `src/hooks/query/README.md` |
| Re-export from index        | Every folder has an `index.ts` barrel file                |
| Selectors only              | Never subscribe to the whole Zustand store                |
| Typed routes                | All routes are type-safe via Expo Router                  |

### Environment Validation

Environment variables are validated at build time via Zod schema (`src/schemas/env.ts`). Direct access to `process.env` is blocked by an ESLint rule — use `CONFIG` from `@/config` instead.

## Environment Variables

| Variable                | Description                                  | Example                   |
| ----------------------- | -------------------------------------------- | ------------------------- |
| `EXPO_PUBLIC_RUN_MODE`  | App environment                              | `dev` / `stg` / `prod`    |
| `EXPO_PUBLIC_API_URL`   | API base URL                                 | `https://api.example.com` |
| `STRICT_ENV_VALIDATION` | Enable strict Zod validation before prebuild | `true` / `false`          |
