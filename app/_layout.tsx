import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Dokdo: require("../assets/fonts/Dokdo-Regular.ttf"),
    Agdasima: require("../assets/fonts/Agdasima-Regular.ttf"),
  });

  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/screens');
    }
  }, [user, loading]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#9cebff' },
          headerTintColor: '#000000',
          headerTitleStyle: { fontFamily: 'Dokdo', fontSize: 24, color: '#000000' },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
        <Stack.Screen name="screens" options={{ headerShown: false }} />
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
      {(!fontsLoaded || loading) && (
        <View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#9cebff'
        }} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
