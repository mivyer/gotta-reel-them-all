import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function NamedReleaseConfirmScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const removeReel = useGameStore((s) => s.removeReel);
  const reel = reels.find((r) => r.id === reelId);
  const cardAnim = useRef(new Animated.Value(1)).current;

  const handleRelease = () => {
    if (!reelId) return;
    Animated.timing(cardAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      removeReel(reelId);
      router.replace({ pathname: '/release/named-post', params: { name: reel?.name ?? '', color: reel?.color ?? 'blue' } });
    });
  };

  if (!reel) return <View style={styles.container}><Text style={styles.error}>Reel not found.</Text></View>;

  const isBlue = reel.color === 'blue';
  const accent = isBlue ? '#9cebff' : '#ff7ac1';
  const bgImage = isBlue
    ? require('@/assets/figma/release-named-blue.png')
    : require('@/assets/figma/release-named-pink.png');

  return (
    <View style={styles.container}>
      {/* Figma creature as main visual */}
      <Animated.View style={{ opacity: cardAnim }}>
        <Image source={bgImage} style={[styles.creatureImg, { width: W, height: W * 0.55 }]} resizeMode="contain" />
      </Animated.View>

      <View style={styles.content}>
        {reel.name !== 'Unknown Reel' && <Text style={styles.reelName}>"{reel.name}"</Text>}

        {/* Exact Figma question text */}
        <Text style={styles.question}>
          Are you sure you want to{'\n'}release this bug-reel?
        </Text>

        {/* Cancel | Release — matching Figma */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.releaseBtn, { backgroundColor: accent }]} onPress={handleRelease} activeOpacity={0.8}>
            <Text style={styles.releaseBtnText}>Release</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  creatureImg: { alignSelf: 'center', marginTop: 60 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, gap: 20 },
  reelName: { fontFamily: 'Agdasima_400Regular', fontSize: 18, color: '#a7a7a7', textAlign: 'center' },
  question: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 34,
  },
  btnRow: { flexDirection: 'row', gap: 14, width: '100%' },
  cancelBtn: {
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  cancelBtnText: { fontFamily: 'Agdasima_400Regular', fontSize: 20, color: '#000000' },
  releaseBtn: {
    flex: 1, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  releaseBtnText: { fontFamily: 'Agdasima_400Regular', fontSize: 20, color: '#000000' },
  error: { fontFamily: 'Agdasima_400Regular', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
