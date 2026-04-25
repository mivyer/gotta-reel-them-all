import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useGameStore, REEL_VIDEOS } from '../../store/useGameStore';
import BugReel1 from '../../components/bug-reel1';
import BugReel2 from '../../components/bug-reel2';

const PLACEHOLDER = require('../../assets/images/thumbnail-placeholder.png');

export default function CatchPopup() {
  const router = useRouter();
  const { bugId } = useLocalSearchParams();
  const addReel = useGameStore((s) => s.addReel);

  const reelRef = useRef<{ id: string; videoUrl: any; color: 'blue' | 'pink' } | null>(null);

  useEffect(() => {
    const color: 'blue' | 'pink' = bugId === '1' ? 'blue' : 'pink';
    const videoUrl = REEL_VIDEOS[Math.floor(Math.random() * REEL_VIDEOS.length)];
    const newReel = {
      id: Date.now().toString(),
      name: 'Unknown Reel',
      thumbnail: PLACEHOLDER,
      videoUrl,
      color,
      caughtAt: Date.now(),
    };
    addReel(newReel);
    reelRef.current = newReel;
  }, []);

  const handleTap = () => {
    const reel = reelRef.current;
    if (!reel) return;
    router.push({
      pathname: '/reel/view',
      params: {
        reelId: reel.id,
        name: 'Unknown Reel',
        video: JSON.stringify(reel.videoUrl),
      },
    });
  };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={handleTap} activeOpacity={1}>
      <LinearGradient colors={['#87ceeb', '#ffffff']} style={styles.container}>
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
    fontFamily: 'Agdasima',
  },
});
