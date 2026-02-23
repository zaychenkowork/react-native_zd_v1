import { StyleSheet } from 'react-native-unistyles';

import { darkColors, lightColors } from './colors';
import { fontSizes, fontWeights } from './fonts';
import { breakpoints, radius, spacing } from './metrics';

const shared = {
  spacing,
  radius,
  font: { sizes: fontSizes, weights: fontWeights },
} as const;

const lightTheme = { colors: lightColors, ...shared };
const darkTheme = { colors: darkColors, ...shared };

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging required by Unistyles
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging required by Unistyles
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});
