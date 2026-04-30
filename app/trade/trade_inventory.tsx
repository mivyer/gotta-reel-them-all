import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGameStore, InventoryItem } from "../../store/useGameStore";
import FriendDetailScreen from "../friends/detail";

const INVENTORY_SIZE = 12;

const bugReelFrames = [
  require("../../assets/images/bugreel0.png"),
  require("../../assets/images/bugreel1.png"),
  require("../../assets/images/bugreel2.png"),
  require("../../assets/images/bugreel3.png"),
];

const emptyReelFrames = [
  require("../../assets/images/empty-reel0.png"),
  require("../../assets/images/empty-reel1.png"),
  require("../../assets/images/empty-reel2.png"),
  require("../../assets/images/empty-reel3.png"),
];

const NUM_BUGREEL_FRAMES = 4;
const NUM_EMPTY_FRAMES = 4;
const releaseReel = useGameStore((s) => s.releaseReel);

export default function TradeInventory() {
  const { friendId, friendUsername } = useLocalSearchParams<{
    friendId: string;
    friendUsername: string;
  }>();

  const router = useRouter();
  const inventory = useGameStore((s) => s.inventory);

  const slots = Array.from(
    { length: INVENTORY_SIZE },
    (_, i) => inventory[i] ?? null
  );

  const handleSelect = (item: InventoryItem | null) => {
    if (!item) return;
    releaseReel(item.reelId);
    // router.push({
    //   pathname: "/trade",
    //   params: {
    //     reelId: item.reelId,
    //     name: item.name,
    //     friendId,
    //     friendUsername,
    //   },
    router.push({
      pathname: "/trade/sent",  
      params: {
        reelId: item.reelId,
        name: item.name,
        friendUsername: friendUsername,
      },
    });
  };

  const renderItem = ({ item }: { item: InventoryItem | null }) => {
    const isEmpty = item === null;
    return (
      <TouchableOpacity
        style={styles.slot}
        onPress={() => handleSelect(item)}
        disabled={isEmpty}
      >
        <View style={styles.frameContainer}>
          {isEmpty ? (
            <Image
              source={emptyReelFrames[Math.floor(Math.random() * NUM_EMPTY_FRAMES)]}
              style={styles.frameImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={bugReelFrames[Math.floor(Math.random() * NUM_BUGREEL_FRAMES)]}
              style={styles.frameImage}
              resizeMode="contain"
            />
          )}
        </View>
        {!isEmpty && (
          <Text style={styles.reelName}>{item.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ position: "relative" }}>
          <Text style={styles.outline}>Inventory</Text>
          <Text style={styles.title}>Inventory</Text>
        </View>
        <Text style={styles.capacity}>
          Trading with: {friendUsername} ({inventory.length} / {INVENTORY_SIZE})
        </Text>
      </View>

      <FlatList
        data={slots}
        renderItem={renderItem}
        keyExtractor={(_, index) => `slot-${index}`}
        numColumns={2}
        style={{ flex: 1 }}
      />
    </View>
  );
}
const SLOT_SIZE = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#9DEBFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Dokdo",
    color: "black",
  },
  outline: {
    position: "absolute",
    fontSize: 65,
    fontFamily: "Dokdo",
    color: "white",
    left: -10,
    top: 0,
  },
  capacity: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#444",
    fontFamily: "Dokdo",
  },
  slot: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  frameContainer: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  frameImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    width: 45,
    height: 70,
    borderRadius: 3,
    backgroundColor: "black",
  },
  reelName: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    fontFamily: "Agdasima",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    paddingTop: 60,
    width: "55%",
    height: "80%",
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
  renameModalContent: {
    paddingTop: 60,
    width: "30%",
    height: "50%",
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
  modalFrameContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalFrame: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  modalThumbnail: {
    width: "35%",
    height: "50%",
    borderRadius: 10,
    backgroundColor: "black",
  },
  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    width: 90,
  },
  blueButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#9DEBFF",
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Agdasima",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  closeX: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
});