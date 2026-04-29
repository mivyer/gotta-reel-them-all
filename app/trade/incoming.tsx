import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { acceptIncoming, declineIncoming } from '../../services/tradeService';
import FigmaHeader from '../../components/FigmaHeader';

export default function IncomingTradesScreen() {
  const router = useRouter();
  const user = useGameStore((s) => s.user);
  const friends = useGameStore((s) => s.friends);
  const incoming = useGameStore((s) => s.incoming);
  const inventory = useGameStore((s) => s.inventory);
  const setInventory = useGameStore((s) => s.setIncoming);

  const [actionId, setActionId] = useState<string | null>(null);

  // Build list from friends array — slot index = friend's index
  const pendingTrades = friends
    .map((friend, index) => {
      const slot = incoming[String(index)];
      return slot ? { friend, index, slot } : null;
    })
    .filter(Boolean) as { friend: { uid: string; username: string }; index: number; slot: { reelId: string; reelName: string } }[];

  const handleAccept = async (item: typeof pendingTrades[number]) => {
    if (!user?.uid) return;
    const key = String(item.index);
    setActionId(key);
    try {
      await acceptIncoming(user.uid, item.index, item.slot.reelId, item.slot.reelName, inventory);
      // The onSnapshot in useUserData will sync both inventory and incoming automatically
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (item: typeof pendingTrades[number]) => {
    if (!user?.uid) return;
    const key = String(item.index);
    setActionId(key);
    try {
      await declineIncoming(user.uid, item.index);
    } finally {
      setActionId(null);
    }
  };

  const renderTrade = ({ item }: { item: typeof pendingTrades[number] }) => {
    const key = String(item.index);
    const busy = actionId === key;
    return (
      <View style={styles.card}>
        <View style={styles.reelIcon}>
          <View style={styles.reelIconInner} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.reelName}>"{item.slot.reelName}"</Text>
          <Text style={styles.fromText}>from {item.friend.username}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => handleAccept(item)}
            disabled={!!actionId}
          >
            {busy ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.acceptText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.declineBtn]}
            onPress={() => handleDecline(item)}
            disabled={!!actionId}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FigmaHeader title="INCOMING" onBack={() => router.back()} />

      {pendingTrades.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No pending trades</Text>
          <Text style={styles.emptyBody}>When a friend sends you a reel, it'll show up here.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingTrades}
          keyExtractor={(t) => String(t.index)}
          contentContainerStyle={styles.list}
          renderItem={renderTrade}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
  emptyBody: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7', textAlign: 'center' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reelIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#d9f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9cebff',
  },
  cardInfo: { flex: 1, gap: 2 },
  reelName: { fontFamily: 'Dokdo', fontSize: 20, color: '#000000' },
  fromText: { fontFamily: 'Agdasima', fontSize: 14, color: '#a7a7a7' },
  cardActions: { gap: 6 },
  btn: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', minWidth: 72 },
  acceptBtn: { backgroundColor: '#9cebff' },
  declineBtn: { backgroundColor: '#e8e8e8' },
  acceptText: { fontFamily: 'Agdasima', fontSize: 15, color: '#000000' },
  declineText: { fontFamily: 'Agdasima', fontSize: 15, color: '#888888' },
});
