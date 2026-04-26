import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
      {/* simple avatar */}
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

  const slots = Array.from(
    { length: Math.max(friends.length + 2, 6) },
    (_, i) => friends[i] ?? null
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>FRIENDS</Text>

        <View style={styles.headerBottom}>
          <Text style={styles.capacityText}>
            Capacity: {friends.length} / {MAX_FRIENDS}
          </Text>

          <TouchableOpacity
            style={styles.addFriendButton}
            onPress={() => router.push('/friends/request')}
          >
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FRIEND GRID */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.friendsGrid}>
          {slots.map((friend, i) =>
            friend ? (
              <FriendSlot
                key={friend.uid}
                friend={friend}
                onPress={() =>
                  router.push({
                    pathname: '/friends/detail',
                    params: { friendId: friend.uid },
                  })
                }
              />
            ) : (
              <EmptyFriendSlot key={`empty-${i}`} />
            )
          )}
        </View>

        {friends.length === 0 && (
          <View style={styles.emptyHint}>
            <Text style={styles.emptyHintText}>No friends yet!</Text>
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
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  friendSlot: {
    width: 80,
    alignItems: 'center',
    gap: 4,
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
    width: 80,
    alignItems: 'center',
    gap: 4,
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
