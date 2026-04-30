import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';

import { REELS_DATABASE } from '../../constants/reels-database';
import BugReel1 from '../../components/bug-reel1';
import BugReel2 from '../../components/bug-reel2';

export default function CatchPopup() {
  const router = useRouter();

  const addReel = useGameStore((s) => s.addReel);

  const reelRef = useRef<{ reelId: string } | null>(null);

  useEffect(() => {
    const reelId = String(Math.floor(Math.random() * 20));

    reelRef.current = { reelId };
  }, []);

  const handleTap = () => {
    const reel = reelRef.current;
    if (!reel) return;

    const video = REELS_DATABASE[reel.reelId];

    router.push({
      pathname: '/reel/view-from-wild',
      params: {
        reelId: reel.reelId,
        name: "Wild Reel",
        video: JSON.stringify(video)
      },
    });
  };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={handleTap} activeOpacity={1}>
      <LinearGradient colors={['#87ceeb', '#ffffff']} style={styles.container}>
        <Text style={styles.title}>you caught it congrats!</Text>

        <View style={styles.bugContainer}>
          {Math.random() > 0.5 ? <BugReel1 /> : <BugReel2 />}
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
    fontFamily: 'Agdasima',
  },
});