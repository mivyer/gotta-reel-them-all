import { View, Text, Image } from "react-native";
import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Font from "expo-font";

const releaseFrames = [
  require("../assets/images/release-reel0.png"),
  require("../assets/images/release-reel1.png"),
];

const NUM_RELEASE_FRAMES = 2;

export default function ReleaseScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontFamily: "Dokdo" }}>
        {name} has been released into the wild...
      </Text>
      <Image source={releaseFrames[Math.floor(Math.random() * NUM_RELEASE_FRAMES)]} />
    </View>
  );
}