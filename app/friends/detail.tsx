import React, { useEffect, useState } from 'react';
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
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../../services/firebase';

export default function FriendDetailScreen() {
  const { friendId, friendUsername } = useLocalSearchParams<{
    friendId: string;
    friendUsername: string;
  }>();

  const router = useRouter();
  const inventory = useGameStore((s) => s.inventory);

  const [friend, setFriend] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------
  // FETCH FRIEND BY ID (FIXED)
  // ------------------------
  useEffect(() => {
    async function loadFriend() {
      try {
        if (!friendId) return;

        const snap = await getDoc(doc(DB, 'users', friendId));

        if (!snap.exists()) {
          setFriend(null);
          setLoading(false);
          return;
        }

        const data = snap.data();

        console.log('Friend Firestore data:', data);

        setFriend({
          id: snap.id,
          username: data.username || friendUsername,
          inventory: Array.isArray(data.inventory) ? data.inventory : [],
          friends: data.friends || [],
        });
      } catch (err) {
        console.log('Error loading friend:', err);
        setFriend(null);
      } finally {
        setLoading(false);
      }
    }

    loadFriend();
  }, [friendId]);

  // ------------------------
  // LOADING
  // ------------------------
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Loading...</Text>
      </View>
    );
  }

  // ------------------------
  // NOT FOUND
  // ------------------------
  if (!friend) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Friend not found.</Text>
      </View>
    );
  }

  const friendInventory = friend.inventory || [];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{friend.username}'s inventory</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Trade Button */}
        <TouchableOpacity
          style={styles.tradeBtn}
          onPress={() =>
            router.push({
              pathname: '../trade',
              params: { friendId },
            })
          }
        >
          <Text style={styles.tradeBtnText}>Trade Reels</Text>
        </TouchableOpacity>

        {/* LIST OF REELS */}
        <Text style={styles.sectionTitle}>Reel Names</Text>

        {friendInventory.length === 0 ? (
          <Text style={styles.emptyText}>No reels yet</Text>
        ) : (
          <View style={styles.list}>
            {friendInventory.map((reel: any, i: number) => (
              <Text key={i} style={styles.item}>
                • {reel.name || 'Unnamed'}
              </Text>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{friendInventory.length}</Text>
            <Text style={styles.statLabel}>Total Reel{friendInventory.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },

  header: {
    backgroundColor: '#9cebff',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  headerTitle: {
    fontFamily: 'Dokdo',
    fontSize: 64,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 70,
    marginTop: 8,
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
  username: {
    fontFamily: 'Dokdo',
    fontSize: 32,
    color: '#000000',
  },

  count: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#a7a7a7',
  },

  tradeBtn: {
    backgroundColor: '#9cebff',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },

  tradeBtnText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
  },

  sectionTitle: {
    fontFamily: 'Dokdo',
    fontSize: 28,
    color: '#000000',
  },

  list: {
    gap: 6,
  },

  item: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
  },

  emptyText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#a7a7a7',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },

  statBox: { flex: 1, alignItems: 'center', gap: 4 },

  statVal: {
    fontFamily: 'Dokdo',
    fontSize: 32,
    color: '#000000',
  },

  statLabel: {
    fontFamily: 'Agdasima',
    fontSize: 13,
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