import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore, Friend } from '../../store/useGameStore';

const MAX_FRIENDS = 25;

function FriendSlot({
  friend,
  onPress,
}: {
  friend: Friend;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.friendSlot}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.friendIcon}>
        <View style={styles.friendIconHead} />
        <View style={styles.friendIconBody} />
      </View>

      <View style={styles.friendShadow} />

      <Text style={styles.friendName} numberOfLines={1}>
        {friend.username}
      </Text>
    </TouchableOpacity>
  );
}

function EmptyFriendSlot() {
  return (
    <View style={styles.emptyFriendSlot}>
      <View style={styles.emptyFriendIcon} />
      <View style={styles.emptyFriendShadow} />
    </View>
  );
}

export default function FriendsScreen() {
  const router = useRouter();
  const friends = useGameStore((s) => s.friends);
  const incoming = useGameStore((s) => s.incoming);

  const incomingCount = friends.filter((_, i) => incoming[String(i)]).length;

  // Fill up to max capacity
  const slots = Array.from(
    { length: MAX_FRIENDS },
    (_, i) => friends[i] ?? null
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/screens')}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>FRIENDS</Text>

        <View style={styles.headerBottom}>
          <Text style={styles.capacityText}>
            Capacity: {friends.length} / {MAX_FRIENDS}
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.incomingButton}
              onPress={() => router.push('/trade/incoming')}
            >
              <Text style={styles.incomingText}>Trades</Text>
              {incomingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{incomingCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={() => router.push('/friends/request')}
            >
              <Text style={styles.addFriendText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* GRID */}
      <FlatList
        data={slots}
        keyExtractor={(_, index) => `friend-slot-${index}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          if (item) {
            return (
              <FriendSlot
                friend={item}
                onPress={() =>
                  router.push({
                    pathname: '/friends/detail',
                    params: { friendId: item.uid },
                  })
                }
              />
            );
          }

          return <EmptyFriendSlot />;
        }}
      />

      {/* EMPTY STATE */}
      {friends.length === 0 && (
        <View style={styles.emptyHint}>
          <Text style={styles.emptyHintText}>No friends yet!</Text>
        </View>
      )}
    </View>
  );
}

const NUM_COLUMNS = 3;

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
    fontFamily: 'Dokdo',
    fontSize: 64,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 70,
    marginTop: 8,
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  capacityRow: {
    flexDirection: 'row',
  },
  capacityText: {
    fontFamily: 'Dokdo',
    fontSize: 22,
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  incomingButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  incomingText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
  },
  badge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'Agdasima',
    fontSize: 12,
    color: '#ffffff',
  },
  addFriendButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addFriendText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  friendSlot: {
    width: "30%",
    alignItems: "center",
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  friendIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendIconHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 2,
  },
  friendIconBody: {
    width: 30,
    height: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  friendShadow: {
    width: 60,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9cebff',
  },
  friendName: {
    fontFamily: 'Agdasima',
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
  },
  emptyFriendSlot: {
    width: "30%",
    alignItems: "center",
  },
  emptyFriendIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#d9d9d9',
  },
  emptyFriendShadow: {
    width: 60,
    height: 10,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: '#e8e8e8',
  },
  emptyHint: {
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
  emptyHintText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#a7a7a7',
  },
  addButton: {
    backgroundColor: '#9cebff',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  addButtonText: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#000000',
  },
});
