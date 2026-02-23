import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useAuthStore } from '@/store';

export function HomeScreen() {
  const { t } = useTranslation();
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('home.title')}
      </Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('auth.signOut')}
        style={styles.button}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>{t('auth.signOut')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(6),
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.font.sizes['2xl'],
    fontWeight: theme.font.weights.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing(8),
  },
  button: {
    paddingHorizontal: theme.spacing(8),
    paddingVertical: theme.spacing(3.5),
    backgroundColor: theme.colors.destructive,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.destructiveForeground,
  },
}));
