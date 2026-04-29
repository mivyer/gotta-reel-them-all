// import { View, Text, Image } from "react-native";
// import { useEffect } from "react";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import * as Font from "expo-font";

// const releaseFrames = [
//   require("../assets/images/release-reel0.png"),
//   require("../assets/images/release-reel1.png"),
// ];

// const NUM_RELEASE_FRAMES = 2;

// export default function ReleaseScreen() {
//   const router = useRouter();
//   const { name } = useLocalSearchParams();

//   return (
//     <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 24, fontFamily: "Dokdo" }}>
//         {name} has been released into the wild...
//       </Text>
//       <Image source={releaseFrames[Math.floor(Math.random() * NUM_RELEASE_FRAMES)]} />
//     </View>
//   );
// }

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import BugReel1 from "@/components/bug-reel1";
import BugReel2 from "@/components/bug-reel2";

export default function CatchPopup() {
  const router = useRouter();
  const { bugId } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    'Dokdo': require('@/assets/fonts/Dokdo.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#87ceeb', '#ffffff']}
      style={styles.container}
    >
      {/* X button — goes back to previous screen */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Bug + dashed path section */}
      <View style={styles.topSection}>
        {/* Bug component pinned at top left of the path */}
        <View style={styles.bugWrapper}>
          {bugId === '1' ? <BugReel1 /> : <BugReel2 />}
        </View>

        {/* Dashed path image */}
        <Image
          source={require('@/features/assets/Vector 177.png')}
          style={styles.pathImage}
          resizeMode="contain"
        />
      </View>

      {/* Text */}
      <View style={styles.textSection}>
        <Text style={styles.title}>You released the{'\n'}bug-reel...</Text>
        <Text style={styles.subtitle}>Bye-Bye!</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  // X button top right
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  // Bug + path grouped together in upper portion
  topSection: {
    marginTop: 100,
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 40,
    position: 'relative',
  },
  bugWrapper: {
    zIndex: 2,
    marginBottom: -10, // overlap slightly with path start
  },
  pathImage: {
    width: '60%',
    height: 140,
    marginLeft: 20,
  },

  // Words lower on the screen
  textSection: {
    marginTop: 60,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Dokdo',
    textAlign: 'center',
    lineHeight: 40,
    color: '#111',
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Dokdo',
    color: '#111',
  },
});