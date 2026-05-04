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
import { useGameStore, InventoryItem } from "../../store/useGameStore";
import { REELS_DATABASE, EMPTY_REEL_FRAMES, BUG_REEL_FRAMES } from "../../constants/reels-database";

const INVENTORY_SIZE = 12;



const NUM_BUGREEL_FRAMES = 4;
const NUM_EMPTY_FRAMES = 4;

export default function InventoryScreen() {
  const router = useRouter();

  const inventory = useGameStore((s) => s.inventory);
  const releaseReel = useGameStore((s) => s.releaseReel);
  const renameReel = useGameStore((s) => s.renameReel);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // always up-to-date from Zustand
  const selected =
    inventory.find((r) => r.reelId === selectedId) ?? null;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] =
    useState<"actions" | "confirmRelease">("actions");

  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState("");

  const slots = Array.from(
    { length: INVENTORY_SIZE },
    (_, i) => inventory[i] ?? null
  );

  const handleSelect = (item: InventoryItem | null) => {
    if (!item) return;
    setSelectedId(item.reelId);
    setModalVisible(true);
  };

  const handleRelease = () => {
    releaseReel(selectedId!);
    if (!selected) return;
    router.push({
      pathname: "/release/named-post",
      params: {
        name: selected.name,
        reelId: selected.reelId
      },
    });
    setModalVisible(false);
  };

  const handleRename = () => {
    if (!selected) return;
    setRenameText(selected.name);
    setRenameVisible(true);
  };

  const confirmRename = () => {
    if (!selected) return;
    renameReel(selected.reelId, renameText);
    setRenameVisible(false);
  };

  const handleWatch = () => {
    if (!selected) return;

    const video = REELS_DATABASE[selected.reelId];

    router.push({
      pathname: "/reel/view-from-inventory",
      params: {
        reelId: selected.reelId,
        name: selected.name,
        video: JSON.stringify(video)
      },
    });

    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: InventoryItem | null }) => {
    const isEmpty = item === null;
    return (
      <TouchableOpacity
        style={styles.slot}
        onPress={() => item && handleSelect(item)}
        disabled={!item}
      >
        <View style={styles.frameContainer}>
          {isEmpty ? (
            <Image
              source={
                EMPTY_REEL_FRAMES[
                Math.floor(Math.random() * NUM_EMPTY_FRAMES)
                ]
              }
              style={styles.frameImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={
                BUG_REEL_FRAMES[
                Math.floor(Math.random() * NUM_BUGREEL_FRAMES)
                ]
              }
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
          <Text style={styles.title}>Inventory</Text>
        </View>
        <Text style={styles.capacity}>
          capacity: ({inventory.length} / {INVENTORY_SIZE})
        </Text>
      </View>

      <FlatList
        data={slots}
        renderItem={renderItem}
        keyExtractor={(_, index) => `slot-${index}`}
        numColumns={2}
        style={{ flex: 1 }}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selected && (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 30,
                    fontFamily: "Dokdo",
                  }}
                >
                  Your Bug Reel:
                </Text>

                <View style={styles.modalFrameContainer}>
                  <Image
                    source={BUG_REEL_FRAMES[0]}
                    style={styles.modalFrame}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: "Agdasima",
                  }}
                >
                  Name: {selected.name}
                </Text>
              </View>
            )}

            {modalMode === "actions" && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={() =>
                    setModalMode("confirmRelease")
                  }
                >
                  <Text style={styles.buttonText}>
                    Release
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={handleWatch}
                >
                  <Text style={styles.buttonText}>
                    Watch
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={handleRename}
                >
                  <Text style={styles.buttonText}>
                    Rename
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {modalMode === "confirmRelease" && (
              <View
                style={{
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  Are you sure you want to release this bug reel?
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={styles.greyButton}
                    onPress={() =>
                      setModalMode("actions")
                    }
                  >
                    <Text style={styles.buttonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.blueButton}
                    onPress={handleRelease}
                  >
                    <Text style={styles.buttonText}>
                      Release
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeX}
              onPress={() => {
                setModalVisible(false);
                setModalMode("actions");
              }}
            >
              <Image
                source={require("../../assets/images/close-button.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RENAME MODAL */}
      <Modal visible={renameVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.renameModalContent}>
            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Rename Reel
            </Text>

            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              autoFocus
              style={{
                borderWidth: 1,
                width: "100%",
                padding: 10,
                marginBottom: 10,
                borderRadius: 8,
              }}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.greyButton}
                onPress={() =>
                  setRenameVisible(false)
                }
              >
                <Text style={styles.buttonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueButton}
                onPress={confirmRename}
              >
                <Text style={styles.buttonText}>
                  Confirm
                </Text>
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
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#9DEBFF",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 64,
    marginBottom: 10,
    fontFamily: "Dokdo",
    color: "black",
  },
  capacity: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "left",
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
  modalContent: {
    paddingTop: 60,
    width: "90%",        // 👈 wider, was 55%
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,    // 👈 add rounded corners
  },
  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    width: 100,          // 👈 slightly wider, was 90
    alignItems: 'center', // 👈 center the text
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
