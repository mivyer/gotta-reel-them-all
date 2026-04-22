import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';
import ReelFrame from '@/components/ReelFrame';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function CatchConfirmScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const reel = reels.find((r) => r.id === reelId);

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 16 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleTap = () => {
    if (reel) router.push({ pathname: '/reel/view', params: { reelId: reel.id, name: reel.name, video: JSON.stringify(reel.videoUrl) } });
  };

  if (!reel) return <View style={styles.container} />;

  const isBlue = reel.color === 'blue';
  const bgImage = isBlue
    ? require('@/assets/figma/catch-confirm-blue.png')
    : require('@/assets/figma/catch-confirm-pink.png');

  return (
    <TouchableOpacity style={styles.container} onPress={handleTap} activeOpacity={1}>
      {/* Figma background */}
      <Image source={bgImage} style={styles.bgImage} resizeMode="cover" />

      {/* Animated reel frame */}
      <Animated.View style={[styles.frameWrap, { transform: [{ scale }], opacity }]}>
        <ReelFrame
          videoUrl={reel.videoUrl}
          color={reel.color}
          width={W * 0.72}
          height={W * 0.72 * 0.65}
          playing
          muted={false}
        />
      </Animated.View>

      {/* Figma text */}
      <Animated.View style={[styles.textWrap, { opacity }]}>
        <Text style={styles.congratsText}>you caught it congrats!</Text>
        <Text style={styles.tapText}>tap anywhere to proceed</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9cebff', alignItems: 'center', justifyContent: 'center' },
  bgImage: { ...StyleSheet.absoluteFillObject as any, width: '100%', height: '100%', opacity: 0.5 },
  frameWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  textWrap: { alignItems: 'center', marginTop: 40, gap: 12 },
  congratsText: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
  },
  tapText: {
    fontFamily: 'Agdasima_400Regular',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.6,
  },
});
