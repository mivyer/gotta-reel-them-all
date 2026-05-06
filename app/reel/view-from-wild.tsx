import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGameStore } from "../../store/useGameStore";
import { useRef, useState } from "react";

export default function WatchScreen() {
  const router = useRouter();
  const { reelId, name, video } = useLocalSearchParams();
  const videoRef = useRef<Video>(null);

  const inventory = useGameStore((s) => s.inventory);

  const parsedVideo = JSON.parse(video as string);

  const MAX_INVENTORY = 12;
  const isInventoryFull = inventory.length >= MAX_INVENTORY;

  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>"{name}"</Text>

      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={parsedVideo}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />
      </View>

      <TouchableOpacity style={styles.closeX} onPress={() => router.back()}>
        <Image
          source={require("../../assets/images/close-button.png")}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {reelId && (
        <View style={styles.btnRow}>
          {/* RELEASE BUTTON */}
          <TouchableOpacity
            style={styles.inventoryBtn}
            onPress={async () => {
              await videoRef.current?.stopAsync();
              router.push({
                pathname: "/release/wild-confirmation",
                params: {
                  reelId: reelId,
                  video: video,
                },
              });
            }}
          >
            <Text style={styles.nameBtnText}>Release it :/</Text>
          </TouchableOpacity>

          {/* NAME IT BUTTON (always same button now) */}
          <TouchableOpacity
            style={styles.nameBtn}
            onPress={async () => {
              await videoRef.current?.stopAsync();

              if (isInventoryFull) {
                setModalVisible(true);
                return;
              }

              router.push({
                pathname: "/reel/name",
                params: { reelId: reelId as string },
              });
            }}
          >
            <Text style={styles.nameBtnText}>Name it!</Text>
          </TouchableOpacity>
        </View>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  videoWrapper: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  video: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: "100%",
  },

  title: {
    color: "white",
    fontSize: 40,
    marginBottom: 20,
    fontFamily: "Dokdo",
    textAlign: "center",
  },

  closeX: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },

  iconImage: {
    width: 50,
    height: 50,
  },

  btnRow: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    gap: 16,
  },

  nameBtn: {
    backgroundColor: "#9cebff",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },

  inventoryBtn: {
    backgroundColor: "#9cebff",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },

  nameBtnText: {
    fontFamily: "Dokdo",
    fontSize: 24,
    color: "#000000",
  },

  // MODAL
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