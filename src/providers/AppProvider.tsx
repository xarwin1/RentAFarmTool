import React from "react";
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

export default function AppProviders({ children }) {
  const { theme, darkMode } = useTheme();

  const paperTheme = darkMode
    ? {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        primary: theme.primary,
        background: theme.background,
        surface: theme.card,
        onSurface: theme.text,
      },
    }
    : {
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        primary: theme.primary,
        background: theme.background,
        surface: theme.card,
        onSurface: theme.text,
      },
    };

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        {children}
      </SafeAreaProvider>
    </PaperProvider>
  );
}
