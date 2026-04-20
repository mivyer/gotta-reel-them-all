import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from "expo-font";

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Dokdo: require("../assets/fonts/Dokdo-Regular.ttf"),
    Agdasima: require("../assets/fonts/Agdasima-Regular.ttf"),
  });

  if (!loaded) {
    return null; // TODO: or splash screen
  }
  return <Stack />;
}
