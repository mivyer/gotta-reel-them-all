import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
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

  const MAX_INVENTORY = 12;
  const isInventoryFull = inventory.length >= MAX_INVENTORY;

  const [isModalVisible, setModalVisible] = useState(false);


  const [actionId, setActionId] = useState<string | null>(null);

  const bugReelFrames = [
    require("../../assets/images/bugreel0.png"),
    require("../../assets/images/bugreel1.png"),
    require("../../assets/images/bugreel2.png"),
    require("../../assets/images/bugreel3.png"),
  ];

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
        <Image
          source={bugReelFrames[Math.floor(Math.random() * 4)]}
          style={styles.reelIcon}
          resizeMode="contain"
        />

        <View style={styles.cardInfo}>
          <Text style={styles.reelName}>"{item.slot.reelName}"</Text>
          <Text style={styles.fromText}>from {item.friend.username}</Text>
        </View>
        <View style={styles.cardActions}>

        {/* ACCEPT BUTTON */}
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn]}
          onPress={() => {
             if (isInventoryFull) {
                setModalVisible(true);
                return;
              }
              else(handleAccept(item))}}
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
      {/* MODAL */}
        {isModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Inventory is full!</Text>
              <Image
                source={require('../../assets/images/warning.png')}
                style={{ width: 60, height: 60, marginLeft: 8, marginBottom: 5 }}
              />

              <Text style={styles.modalText}>
                You need to release some reels before naming a new one.
              </Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setModalVisible(false);
                  router.push("../screens/inventory");
                }}
              >
                <Text style={styles.modalBtnText}>Go to inventory</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      </View >
    );
};

return (
  <View style={styles.container}>
    <FigmaHeader title="Inbox" onBack={() => router.back()} />

    {pendingTrades.length === 0 ? (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Your Inbox is empty.</Text>
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontFamily: "Dokdo",
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#9cebff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },

  modalBtnSecondary: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },

  modalBtnText: {
    fontFamily: "Dokdo",
    fontSize: 18,
  },
});
