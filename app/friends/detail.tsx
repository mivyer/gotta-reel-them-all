import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import FigmaHeader from '../../components/FigmaHeader';

export default function FriendDetailScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const router = useRouter();

  const friends = useGameStore((s) => s.friends);
  const inventory = useGameStore((s) => s.inventory);

  const friend = friends.find((f) => f.uid === friendId);

  if (!friend) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Friend not found.</Text>
      </View>
    );
  }

  // ⚠️ placeholder until Firestore integration
  const friendReels = []; // later: fetched by friend.id

  return (
    <View style={styles.container}>
      <FigmaHeader title={friend.username} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>

          <Text style={styles.username}>{friend.username}</Text>

          <Text style={styles.reelCount}>
            {friendReels.length} reel{friendReels.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Trade button */}
        <TouchableOpacity
          style={styles.tradeBtn}
          onPress={() =>
            router.push({
              pathname: '../trade',
              params: { friendId: friend.uid },
            })
          }
        >
          <Text style={styles.tradeBtnText}>Trade Reels</Text>
        </TouchableOpacity>

        {/* Reels section */}
        <Text style={styles.sectionTitle}>
          {friend.username}'s Reels
        </Text>

        <Text style={styles.emptyText}>
          Friend reels will load from cloud (not stored locally yet)
        </Text>

        {/* Stats (local placeholder only) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {inventory.filter((r) => r.name !== 'Unnamed Reel :(').length}
            </Text>
            <Text style={styles.statLabel}>Named (you)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },
  avatarSection: { alignItems: 'center', paddingTop: 16, gap: 8 },
  avatar: { alignItems: 'center', marginBottom: 8 },
  avatarHead: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#000000', marginBottom: 4 },
  avatarBody: { width: 90, height: 45, borderTopLeftRadius: 45, borderTopRightRadius: 45, backgroundColor: '#000000' },
  username: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
  reelCount: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7' },
  tradeBtn: { backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  tradeBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  sectionTitle: { fontFamily: 'Dokdo', fontSize: 28, color: '#000000' },
  emptyText: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7' },
  reelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniSlot: { width: 80, height: 80, borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 4 },
  miniSlotLabel: { fontFamily: 'Agdasima', fontSize: 11, color: '#000000', textAlign: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: '#f8f8f8', borderRadius: 16, padding: 16 },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
  statLabel: { fontFamily: 'Agdasima', fontSize: 13, color: '#a7a7a7' },
  statDivider: { width: 1, backgroundColor: '#e8e8e8', marginVertical: 4 },
  error: { fontFamily: 'Agdasima', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
