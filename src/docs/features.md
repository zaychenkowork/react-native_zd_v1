# Features

Business features — screen logic, feature-specific components, and local hooks. Each feature is a self-contained module that assembles UI from global building blocks (`ui/components`, `hooks/query`, `store`, `api`).

Route files in `src/app/` stay thin — they only import and re-export screen components from here.

## Conventions

| Rule                                  | Description                                                         |
| ------------------------------------- | ------------------------------------------------------------------- |
| One feature = one folder              | `src/features/[name]/`                                              |
| Screens in `screens/` subfolder       | `screens/[Name]Screen.tsx` — one flat file per screen               |
| Components in `components/` subfolder | `components/[Name].tsx` — one flat file per component               |
| No barrel files                       | Import from concrete modules; never create `index.ts` re-exports    |
| Feature-local hooks allowed           | `hooks/` inside feature; move to `src/hooks/` when reused elsewhere |

## Types

| Scope                                | Location                                          |
| ------------------------------------ | ------------------------------------------------- |
| Global (API contracts, shared enums) | `src/types/`                                      |
| Component props, local enums         | `types.ts` or `[Name].types.ts` next to component |
| Shared between feature components    | `features/[name]/types.ts`                        |

Single component in a folder — use `types.ts`. Multiple related components — either one `types.ts` for all, or `[Name].types.ts` per component. Both are valid.

## Folder Structure

```
src/features/
├── posts/
│   ├── screens/
│   │   ├── PostsScreen.tsx
│   │   └── PostDetailScreen.tsx
│   ├── components/
│   │   └── PostCard.tsx
│   ├── hooks/                  # (optional) feature-local hooks
│   │   └── usePostFilters.ts
│   └── types.ts                # (optional) shared feature types
└── ...
```

> **No barrel files.** Import screens and components from their concrete paths
> (`@/features/posts/screens/PostsScreen`). See the "No Barrel Files" section in the
> root README for the reasoning and sources.

## Quick Example

Feature screen (`features/posts/screens/PostsScreen/PostsScreen.tsx`):

```tsx
import { FlatList } from 'react-native';

import { usePostsQuery } from '@/hooks/query';

import { PostCard } from '../../components';

export function PostsScreen() {
  const { data: posts } = usePostsQuery();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
```

Thin route file (`app/(app)/posts/index.tsx`):

```tsx
import { PostsScreen } from '@/features/posts';

export default PostsScreen;
```
