import { View, Text, StyleSheet,  TouchableOpacity, Image} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function WatchScreen() {
  const router = useRouter();
  const { reelId, name, video } = useLocalSearchParams();

  // parse the video (because we stringified it)
  const parsedVideo = JSON.parse(video as string);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>"{name}"</Text>

    <View style={styles.videoWrapper}>
        <Video
          source={parsedVideo}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />
      </View>

    <TouchableOpacity
      style={styles.closeX}
      onPress={() => router.back()}
    >
      <Image
        source={require("@/assets/images/close-button.png")}
        style={styles.iconImage}
      />
    </TouchableOpacity>

    {reelId && (
      <TouchableOpacity
        style={styles.nameBtn}
        onPress={() => router.push({ pathname: '/reel/name', params: { reelId: reelId as string } })}
      >
        <Text style={styles.nameBtnText}>Name it!</Text>
      </TouchableOpacity>
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
},
video: {
  width: "100%",
  height: "100%",
  alignSelf: "center" // TODO figure out aspect ratios + centering
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
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#9cebff",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  nameBtnText: {
    fontFamily: "Dokdo_400Regular",
    fontSize: 24,
    color: "#000000",
  },
});
