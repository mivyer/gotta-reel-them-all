import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function WildReleaseConfirmScreen() {
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
      router.replace({ pathname: '/release/wild-post', params: {} });
    });
  };

  if (!reel) return <View style={styles.container}><Text style={styles.error}>Reel not found.</Text></View>;

  const accent = '#9cebff';
  const bgImage = require('../../assets/figma/release-wild-blue.png') | require('../../assets/figma/release-wild-pink.png');

  return (
    <View style={styles.container}>
      {/* Figma creature */}
      <Animated.View style={{ opacity: cardAnim }}>
        <Image source={bgImage} style={[styles.creatureImg, { width: W, height: W * 0.55 }]} resizeMode="contain" />
      </Animated.View>

      <View style={styles.content}>
        {/* Exact Figma question text */}
        <Text style={styles.question}>
          Are you sure you want to{'\n'}release the wild bug-reel?
        </Text>

        {/* Cancel | Release */}
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
  question: {
    fontFamily: 'Dokdo',
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
  cancelBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  releaseBtn: {
    flex: 1, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  releaseBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  error: { fontFamily: 'Agdasima', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
