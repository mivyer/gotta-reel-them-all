import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useGameStore, BugReel } from "../../store/useGameStore";

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

export default function InventoryScreen() {
  const router = useRouter();
  const bugReels = useGameStore((s) => s.reels);
  const removeReel = useGameStore((s) => s.removeReel);
  const nameReel = useGameStore((s) => s.nameReel);

  const [selectedReel, setSelectedReel] = useState<BugReel | null>(null);
  const [modalMode, setModalMode] = useState<"actions" | "confirmRelease">("actions");
  const [modalVisible, setModalVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [reelToRename, setReelToRename] = useState<BugReel | null>(null);

  const reelCount = bugReels.length;
  const inventorySlots = Array.from({ length: INVENTORY_SIZE }, (_, i) => bugReels[i] ?? null);

  const handleSelectReel = (reel: BugReel | null) => {
    if (!reel) return;
    setSelectedReel(reel);
    setModalVisible(true);
  };

  const handleConfirmRelease = () => {
    if (!selectedReel) return;
    removeReel(selectedReel.id);
    setModalVisible(false);
    setModalMode("actions");
    router.push({ pathname: "../release/wild-post", params: {} });
  };

  const handleRenamePress = (reel: BugReel) => {
    setReelToRename(reel);
    setRenameText(reel.name);
    setRenameVisible(true);
  };

  const handleConfirmRename = () => {
    if (!reelToRename) return;
    nameReel(reelToRename.id, renameText);
    setSelectedReel((prev) => (prev ? { ...prev, name: renameText } : null));
    setRenameVisible(false);
    setReelToRename(null);
  };

  const handleWatch = () => {
    if (!selectedReel) return;
    setModalVisible(false);
    setModalMode("actions");
    router.push({ pathname: "/reel/view", params: { reelId: selectedReel.id, name: selectedReel.name, video: JSON.stringify(selectedReel.videoUrl) } });
  };

  const renderItem = ({ item }: { item: BugReel | null }) => {
    const isEmpty = item === null;
    return (
      <TouchableOpacity
        style={styles.slot}
        onPress={() => item && handleSelectReel(item)}
        disabled={!item}
      >
        <View style={styles.frameContainer}>
          {isEmpty ? (
            <Image
              source={emptyReelFrames[Math.floor(Math.random() * NUM_EMPTY_FRAMES)]}
              style={styles.frameImage}
              resizeMode="contain"
            />
          ) : (
            <>
              <Image
                source={bugReelFrames[Math.floor(Math.random() * NUM_BUGREEL_FRAMES)]}
                style={styles.frameImage}
                resizeMode="contain"
              />
              <Image
                source={item.thumbnail}
                style={styles.thumbnailOverlay}
                resizeMode="cover"
              />
            </>
          )}
        </View>
        {!isEmpty && <Text style={styles.reelName}>{item.name}</Text>}
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
          Inventory: {reelCount} / {INVENTORY_SIZE}
        </Text>
      </View>

      <FlatList
        data={inventorySlots}
        extraData={bugReels}
        renderItem={renderItem}
        keyExtractor={(_, index) => `slot-${index}`}
        numColumns={2}
        style={{ flex: 1 }}
      />

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedReel && (
              <View>
                <Text style={{ textAlign: "center", fontSize: 30, fontFamily: "Dokdo" }}>
                  Your Bug Reel:
                </Text>
                <View style={styles.modalFrameContainer}>
                  <Image
                    source={bugReelFrames[0]}
                    style={styles.modalFrame}
                    resizeMode="contain"
                  />
                  <Image
                    source={selectedReel.thumbnail}
                    style={styles.modalThumbnail}
                    resizeMode="cover"
                  />
                </View>
                <Text style={{ textAlign: "left", fontSize: 20, fontFamily: "Agdasima" }}>
                  Name: {selectedReel.name}
                  {"\n"}Caught: {new Date(selectedReel.caughtAt).toLocaleDateString()}
                </Text>
              </View>
            )}

            {modalMode === "actions" && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={() => setModalMode("confirmRelease")}
                >
                  <Text style={styles.buttonText}>Release</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.greyButton} onPress={handleWatch}>
                  <Text style={styles.buttonText}>Watch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={() => handleRenamePress(selectedReel!)}
                >
                  <Text style={styles.buttonText}>Rename</Text>
                </TouchableOpacity>
              </View>
            )}

            {modalMode === "confirmRelease" && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
                  Are you sure you want to release this bug reel?
                </Text>
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <TouchableOpacity
                    style={styles.greyButton}
                    onPress={() => setModalMode("actions")}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.blueButton} onPress={handleConfirmRelease}>
                    <Text style={styles.buttonText}>Release</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeX}
              onPress={() => { setModalVisible(false); setModalMode("actions"); }}
            >
              <Image
                source={require("../../assets/images/close-button.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={renameVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.renameModalContent}>
            <Text style={{ marginBottom: 10, fontSize: 16 }}>Rename Reel</Text>
            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              autoFocus
              style={{ borderWidth: 1, width: "100%", padding: 10, marginBottom: 10, borderRadius: 8 }}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.greyButton} onPress={() => setRenameVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.blueButton} onPress={handleConfirmRename}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SLOT_SIZE = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#9DEBFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
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
