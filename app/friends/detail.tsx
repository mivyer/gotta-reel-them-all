import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore, BugReel } from '@/store/useGameStore';
import FigmaHeader from '@/components/FigmaHeader';

function MiniReelSlot({ reel }: { reel: BugReel }) {
  const isBlue = reel.color === 'blue';
  return (
    <View style={[styles.miniSlot, { backgroundColor: isBlue ? '#9cebff' : '#ff7ac1' }]}>
      <Text style={styles.miniSlotLabel} numberOfLines={1}>
        {reel.name !== 'Unknown Reel' ? reel.name : '—'}
      </Text>
    </View>
  );
}

export default function FriendDetailScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const router = useRouter();
  const friends = useGameStore((s) => s.friends);
  const friend = friends.find((f) => f.id === friendId);

  if (!friend) {
    return <View style={styles.container}><Text style={styles.error}>Friend not found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FigmaHeader title={friend.username} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
          <Text style={styles.username}>{friend.username}</Text>
          <Text style={styles.reelCount}>{friend.reels.length} reel{friend.reels.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Trade button */}
        <TouchableOpacity
          style={styles.tradeBtn}
          onPress={() => router.push({ pathname: '/trade', params: { friendId: friend.id } })}
        >
          <Text style={styles.tradeBtnText}>Trade Reels</Text>
        </TouchableOpacity>

        {/* Reels grid */}
        <Text style={styles.sectionTitle}>{friend.username}'s Reels</Text>
        {friend.reels.length === 0 ? (
          <Text style={styles.emptyText}>No reels yet</Text>
        ) : (
          <View style={styles.reelsGrid}>
            {friend.reels.map((r) => <MiniReelSlot key={r.id} reel={r} />)}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#9cebff' }]}>{friend.reels.filter((r) => r.color === 'blue').length}</Text>
            <Text style={styles.statLabel}>Blue</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#ff7ac1' }]}>{friend.reels.filter((r) => r.color === 'pink').length}</Text>
            <Text style={styles.statLabel}>Pink</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{friend.reels.filter((r) => r.name !== 'Unknown Reel').length}</Text>
            <Text style={styles.statLabel}>Named</Text>
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
  username: { fontFamily: 'Dokdo_400Regular', fontSize: 32, color: '#000000' },
  reelCount: { fontFamily: 'Agdasima_400Regular', fontSize: 18, color: '#a7a7a7' },
  tradeBtn: { backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  tradeBtnText: { fontFamily: 'Agdasima_400Regular', fontSize: 20, color: '#000000' },
  sectionTitle: { fontFamily: 'Dokdo_400Regular', fontSize: 28, color: '#000000' },
  emptyText: { fontFamily: 'Agdasima_400Regular', fontSize: 16, color: '#a7a7a7' },
  reelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniSlot: { width: 80, height: 80, borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 4 },
  miniSlotLabel: { fontFamily: 'Agdasima_400Regular', fontSize: 11, color: '#000000', textAlign: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: '#f8f8f8', borderRadius: 16, padding: 16 },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { fontFamily: 'Dokdo_400Regular', fontSize: 32, color: '#000000' },
  statLabel: { fontFamily: 'Agdasima_400Regular', fontSize: 13, color: '#a7a7a7' },
  statDivider: { width: 1, backgroundColor: '#e8e8e8', marginVertical: 4 },
  error: { fontFamily: 'Agdasima_400Regular', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
