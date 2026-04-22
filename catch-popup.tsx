import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import BugReel1 from "@/components/bug-reel1";
import BugReel2 from "@/components/bug-reel2";

export default function CatchPopup() {
  const router = useRouter();
  const { bugId } = useLocalSearchParams();  // gets the bug ID from catch-page

  const [fontsLoaded] = useFonts({
    'Dokdo': require('@/assets/fonts/Dokdo.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/watch-screen')}>
      <LinearGradient
        colors={['#87ceeb', '#ffffff']}
        style={styles.container}
      >
        <Text style={styles.title}>you caught it congrats!</Text>

        <View style={styles.bugContainer}>
          {bugId === '1' ? <BugReel1 /> : <BugReel2 />}
        </View>

        <Text style={styles.subtitle}>tap anywhere to proceed</Text>

      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  bugContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Dokdo',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Dokdo',
  },
});