# UI Components

Headless components from [React Native Reusables](https://reactnativereusables.com/) (source is copied into the project, not installed as a package) + styles via Unistyles v3. The approach mirrors shadcn/ui — you own every file in `src/ui/primitives/`.

## Conventions

| Rule                       | Description                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| Check primitives first     | Before creating anything, look in `src/ui/primitives/`                                    |
| Source of truth            | [reactnativereusables.com](https://reactnativereusables.com/) — copy source, adapt styles |
| No NativeWind              | `className` / `cn()` / `cva` are replaced by `StyleSheet.create()` from Unistyles v3      |
| Minimum packages           | Only install `@rn-primitives/<name>` that the component actually imports                  |
| Styling only in primitives | Unistyles `StyleSheet.create((theme) => ({...}))` at the bottom of each file              |
| Always merge style prop    | `style={[styles.root, style]}` — allows external overrides                                |
| forwardRef                 | Required for all components that wrap a primitive                                         |

## Folder Structure

```
src/ui/
├── primitives/          ← copied from rnr, NativeWind → Unistyles (you own this code)
│   ├── button.tsx
│   ├── checkbox.tsx
│   └── index.ts
├── components/          ← app-level compositions built from primitives
│   ├── FormField/
│   │   └── index.tsx
│   └── index.ts
└── theme/
    ├── colors.ts        ← light/dark color tokens
    ├── fonts.ts         ← font sizes and weights
    ├── metrics.ts       ← spacing, radius, breakpoints
    └── unistyles.ts     ← StyleSheet.configure() call
```

## How to Add a New Component (Manually)

1. Find the component on [reactnativereusables.com](https://reactnativereusables.com/)
2. Copy the raw source from GitHub:
   ```
   https://raw.githubusercontent.com/mrzachnugent/react-native-reusables/main/packages/registry/src/new-york/components/ui/<name>.tsx
   ```
3. Replace `className` / `cn()` / `cva` with `StyleSheet.create((theme) => ({...}))`
4. Save to `src/ui/primitives/<name>.tsx`
5. Install the minimum dep:
   ```bash
   yarn add @rn-primitives/<name>
   ```

## NativeWind → Unistyles Cheat Sheet

| NativeWind class          | Unistyles equivalent                          |
| ------------------------- | --------------------------------------------- |
| `bg-primary`              | `theme.colors.primary`                        |
| `bg-background`           | `theme.colors.background`                     |
| `text-foreground`         | `theme.colors.foreground`                     |
| `text-muted-foreground`   | `theme.colors.mutedForeground`                |
| `border-input`            | `theme.colors.border`                         |
| `rounded-md`              | `theme.radius.md`                             |
| `p-4`                     | `theme.spacing[4]`                            |
| `dark:bg-xxx`             | handled by dark theme automatically           |
| `disabled:opacity-50`     | `props.disabled && styles.disabled`           |
| `cva(base, { variants })` | `StyleSheet.create` with `variants: {}` block |

## Quick Example

`src/ui/primitives/checkbox.tsx` — adapted from rnr:

```tsx
import React from 'react';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { StyleSheet } from 'react-native-unistyles';

function Checkbox({
  style,
  ...props
}: CheckboxPrimitive.RootProps &
  React.RefAttributes<CheckboxPrimitive.RootRef>) {
  return (
    <CheckboxPrimitive.Root
      style={[styles.root, props.checked && styles.rootChecked, style]}
      hitSlop={24}
      {...props}
    >
      <CheckboxPrimitive.Indicator style={styles.indicator} />
    </CheckboxPrimitive.Root>
  );
}

Checkbox.displayName = 'Checkbox';

export { Checkbox };

const styles = StyleSheet.create((theme) => ({
  root: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  rootChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
```

## Available Components on reactnativereusables.com

```
accordion      alert-dialog   alert          aspect-ratio   avatar
badge          button         card           checkbox       collapsible
context-menu   dialog         dropdown-menu  hover-card     input
label          menubar        popover        progress       radio-group
select         separator      skeleton       switch         tabs
text           textarea       toggle         toggle-group   tooltip
```

## Working with AI

All AI behaviour for this folder is defined in `.cursor/rules/rn-primitives.mdc`. The rule covers the full workflow: checking the local primitives folder, fetching source from reactnativereusables.com, converting NativeWind to Unistyles, deciding which packages to install, and handling design screens.

### When the rule is active

| Situation                                        | What to do                                        |
| ------------------------------------------------ | ------------------------------------------------- |
| Any `src/ui/**/*.tsx` file is open in the editor | Nothing — rule activates automatically via glob   |
| New chat, no `src/ui/` file open                 | Add `@rn-primitives` at the start of your message |

### Prompt templates

Minimal — AI knows what to do from the rule:

```
@rn-primitives Add a Switch.
```

With design screen:

```
@rn-primitives Add a Button with variants: default, destructive, outline, ghost.
[attach design image]
Ask me if anything is unclear before writing any code.
```

With explicit instructions if you want to be sure:

```
@rn-primitives Add a Select dropdown.
Check src/ui/primitives/ first.
If not there — fetch latest source from rnr, convert to Unistyles, install minimum deps.
```

### What the AI does (in order)

1. Reads `src/ui/primitives/` — if the component is already there, uses it
2. If not — fetches current source from the reactnativereusables GitHub registry
3. Converts `className` / `cn()` / `cva` → `StyleSheet.create((theme) => ({...}))`
4. Installs only the `@rn-primitives/<name>` package the component actually imports
5. If a design screen is attached — reads all states, maps colors to theme tokens, asks before coding
6. Saves the adapted file to `src/ui/primitives/<name>.tsx`

## Docs

- [React Native Reusables](https://reactnativereusables.com/)
- [Unistyles v3](https://unistyl.es/v3/start/getting-started/)
- [rn-primitives](https://rnprimitives.com/)
