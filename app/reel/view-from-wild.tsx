import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";

export default function WatchScreen() {
  const router = useRouter();
  const { reelId, name, video } = useLocalSearchParams();
  const videoRef = useRef<Video>(null);

  const parsedVideo = JSON.parse(video as string);

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
          <TouchableOpacity
            style={styles.inventoryBtn}
            onPress={async () => {
              await videoRef.current?.stopAsync();
              router.push({
                pathname: "/release/wild-confirmation",
                params: {
                  reelId: reelId,
                  video: video
                },
              });
              ;
            }}
          >
            <Text style={styles.nameBtnText}>Release it :/</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nameBtn}
            onPress={async () => {
              await videoRef.current?.stopAsync();
              router.push({ pathname: '/reel/name', params: { reelId: reelId as string } });
            }}
          >
            <Text style={styles.nameBtnText}>Name it!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white" // temp for visual purposes
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
    textAlign: "center"
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
  nameBtn: {
    // position: "absolute",
    // bottom: 40,
    // alignSelf: "center",
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
  btnRow: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    gap: 16,
  },
  inventoryBtn: {
    backgroundColor: "#9cebff",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
});
