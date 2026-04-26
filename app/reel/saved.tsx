import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { REELS_DATABASE } from '../../constants/reels-database';
import FigmaHeader from '../../components/FigmaHeader';
import { ReelFrameLarge } from '../../components/ReelFrame';

export default function SavedReelScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();

  const inventory = useGameStore((s) => s.inventory);

  const reelItem = inventory.find((r) => r.reelId === reelId);

  if (!reelId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Reel not found.</Text>
      </View>
    );
  }

  const videoUrl = REELS_DATABASE[reelId as string];
  const name = reelItem?.name || `Reel ${reelId}`;

  const isNamed = !!reelItem?.name;

  const accent = '#9cebff';

  const bgImage =
    Math.random() > 0.5
      ? require('../../assets/figma/saved-reel-blue.png')
      : require('../../assets/figma/saved-reel-pink.png');

  return (
    <View style={styles.container}>
      <Image source={bgImage} style={styles.bgHint} resizeMode="cover" />

      <FigmaHeader
        title={'Saved Reel'}
        subtitle={isNamed ? `"${name}"` : undefined}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ReelFrameLarge videoUrl={videoUrl} playing />

        <Text style={styles.reelName}>"{name}"</Text>

        <View style={styles.infoCard}>
          <InfoRow label="Status" value={isNamed ? 'Named' : 'Unnamed'} />
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: accent }]}
          onPress={() =>
            router.push({
              pathname: '/release/named',
              params: { reelId: reelId as string },
            })
          }
        >
          <Text style={styles.btnText}>Release</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={() => router.back()}>
          <Text style={styles.ghostBtnText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  bgHint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    opacity: 0.08,
  },

  scroll: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
    paddingBottom: 48,
  },

  reelName: {
    fontFamily: 'Agdasima',
    fontSize: 22,
    color: '#000000',
  },

  infoCard: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  infoLabel: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#a7a7a7',
  },

  infoValue: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
  },

  btn: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },

  btnText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
  },

  ghostBtn: {
    paddingVertical: 10,
  },

  ghostBtnText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#a7a7a7',
  },
  error: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 80,
  },
});