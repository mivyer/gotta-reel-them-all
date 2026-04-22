import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';

export default function ProfileScreen() {
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const friends = useGameStore((s) => s.friends);

  const stepCount = 2500;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={styles.capacityRow}>
          <Text style={styles.capacityText}>Friends: {friends.length}/25</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile avatar — Figma hand-drawn character */}
        <View style={styles.avatarSection}>
          <Image
            source={require('@/assets/figma/profile-icon-large.png')}
            style={styles.avatarImg}
            resizeMode="contain"
          />
          {/* Light blue glow under avatar, matching Figma */}
          <View style={styles.avatarGlow} />
          <Text style={styles.username}>user_12</Text>
        </View>

        {/* Steps section */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsLabel}>TOTAL STEPS TAKEN</Text>
          <Text style={styles.stepsNumber}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.stepsUnit}>steps</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{reels.length}</Text>
            <Text style={styles.statLabel}>Total Reels</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#9cebff' }]}>
              {reels.filter((r) => r.color === 'blue').length}
            </Text>
            <Text style={styles.statLabel}>Blue Reels</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#ff7ac1' }]}>
              {reels.filter((r) => r.color === 'pink').length}
            </Text>
            <Text style={styles.statLabel}>Pink Reels</Text>
          </View>
        </View>

        {/* Named reels */}
        {reels.filter((r) => r.name !== 'Unknown Reel').length > 0 && (
          <View style={styles.namedSection}>
            <Text style={styles.sectionTitle}>Named Reels</Text>
            {reels.filter((r) => r.name !== 'Unknown Reel').map((reel) => (
              <View key={reel.id} style={styles.namedRow}>
                <View style={[styles.namedDot, { backgroundColor: reel.color === 'blue' ? '#9cebff' : '#ff7ac1' }]} />
                <Text style={styles.namedText}>{reel.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#9cebff',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backArrow: {
    fontSize: 28,
    color: '#000000',
    lineHeight: 32,
  },
  headerTitle: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 64,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 70,
    marginTop: 8,
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  capacityText: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 22,
    color: '#000000',
  },
  scroll: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  avatarImg: {
    width: 220,
    height: 220,
  },
  avatarGlow: {
    width: 180,
    height: 28,
    borderRadius: 50,
    backgroundColor: '#9cebff',
    opacity: 0.7,
    marginTop: -12,
    marginBottom: 8,
  },
  username: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 24,
    color: '#000000',
    marginBottom: 8,
  },
  stepsSection: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  stepsLabel: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 22,
    color: '#000000',
    marginBottom: 4,
  },
  stepsNumber: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 72,
    color: '#000000',
    lineHeight: 80,
  },
  stepsUnit: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 32,
    color: '#000000',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 32,
    color: '#000000',
  },
  statLabel: {
    fontFamily: 'Agdasima_400Regular',
    fontSize: 13,
    color: '#a7a7a7',
    textAlign: 'center',
  },
  namedSection: {
    marginHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 24,
    color: '#000000',
    marginBottom: 12,
  },
  namedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  namedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  namedText: {
    fontFamily: 'Agdasima_400Regular',
    fontSize: 18,
    color: '#000000',
  },
});
