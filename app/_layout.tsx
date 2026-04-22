import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Dokdo_400Regular } from '@expo-google-fonts/dokdo';
import { Agdasima_400Regular } from '@expo-google-fonts/agdasima';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Dokdo_400Regular,
    Agdasima_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#9cebff' }} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#9cebff' },
          headerTintColor: '#000000',
          headerTitleStyle: { fontFamily: 'Dokdo_400Regular', fontSize: 24, color: '#000000' },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="catch/index" options={{ headerShown: false }} />
        <Stack.Screen name="catch/catch-popup" options={{ headerShown: false }} />
        <Stack.Screen name="catch/confirm" options={{ headerShown: false }} />
        <Stack.Screen name="reel/view" options={{ headerShown: false }} />
        <Stack.Screen name="reel/name" options={{ headerShown: false }} />
        <Stack.Screen name="reel/saved" options={{ headerShown: false }} />
        <Stack.Screen name="bug-info" options={{ headerShown: false }} />
        <Stack.Screen name="release/named" options={{ headerShown: false }} />
        <Stack.Screen name="release/named-post" options={{ headerShown: false }} />
        <Stack.Screen name="release/wild" options={{ headerShown: false }} />
        <Stack.Screen name="release/wild-post" options={{ headerShown: false }} />
        <Stack.Screen name="friends/request" options={{ headerShown: false }} />
        <Stack.Screen name="friends/detail" options={{ headerShown: false }} />
        <Stack.Screen name="trade/index" options={{ headerShown: false }} />
        <Stack.Screen name="trade/sent" options={{ headerShown: false }} />
        <Stack.Screen
          name="checkpoint"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
