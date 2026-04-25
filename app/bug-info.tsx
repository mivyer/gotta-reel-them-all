import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import { ReelFrameLarge } from '../components/ReelFrame';
import FigmaHeader from '../components/FigmaHeader';

export default function BugInfoScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const reel = reels.find((r) => r.id === reelId);

  if (!reel) {
    return <View style={styles.container}><Text style={styles.error}>Reel not found.</Text></View>;
  }

  const isNamed = reel.name !== 'Unknown Reel';
  const bgImage = require('../assets/figma/bug-info-blue.png') | require('../assets/figma/bug-info-pink.png');

  return (
    <View style={styles.container}>
      <FigmaHeader title="Your bug-reel:" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Creature frame with video */}
        <View style={styles.frameSection}>
          <ReelFrameLarge videoUrl={reel.videoUrl} playing />
          {/* Figma glow shadow */}
          <View style={[styles.glow, { backgroundColor: '#9cebff' }]} />
        </View>

        {/* Name */}
        {isNamed ? (
          <Text style={styles.reelName}>Name: "{reel.name}"</Text>
        ) : (
          <Text style={styles.reelNameMuted}>Name: unnamed</Text>
        )}

        {/* Info */}
        <Text style={styles.infoLine}>
          Caught {new Date(reel.caughtAt).toLocaleDateString()} · {isNamed ? 'Named' : 'Unnamed'}
        </Text>

        {/* Bottom buttons: Release | Watch | Rename | Share */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.grayBtn}
            onPress={() => router.push({ pathname: '/release/named', params: { reelId: reel.id } })}
            activeOpacity={0.8}
          >
            <Text style={styles.grayBtnText}>Release</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.grayBtn}
            onPress={() => router.push({ pathname: '/reel/view', params: { reelId: reel.id, name: reel.name, video: JSON.stringify(reel.videoUrl) } })}
            activeOpacity={0.8}
          >
            <Text style={styles.grayBtnText}>Watch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.grayBtn}
            onPress={() => router.push({ pathname: '/reel/name', params: { reelId: reel.id } })}
            activeOpacity={0.8}
          >
            <Text style={styles.grayBtnText}>Rename</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.grayBtn}
            onPress={() => router.push({ pathname: '/trade', params: { friendId: undefined } })}
            activeOpacity={0.8}
          >
            <Text style={styles.grayBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { alignItems: 'center', padding: 24, paddingBottom: 48, gap: 16 },

  frameSection: { alignItems: 'center' },
  glow: {
    width: 180, height: 20, borderRadius: 50,
    opacity: 0.4, marginTop: -6,
  },

  reelName: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
  reelNameMuted: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#a7a7a7',
    textAlign: 'center',
  },
  infoLine: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#a7a7a7',
    textAlign: 'center',
  },

  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  grayBtn: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  grayBtnText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
  },
  error: { fontFamily: 'Agdasima', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
