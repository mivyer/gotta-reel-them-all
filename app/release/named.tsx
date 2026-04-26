import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function NamedReleaseConfirmScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();

  const inventory = useGameStore((s) => s.inventory);
  const removeFromInventory = useGameStore((s) => s.releaseReel);

  const reelItem = inventory.find((r) => r.reelId === reelId);

  const cardAnim = useRef(new Animated.Value(1)).current;

  const handleRelease = () => {
    if (!reelId) return;

    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      removeFromInventory(reelId);

      router.replace({
        pathname: '/release/named-post',
        params: { name: reelItem?.name ?? '' },
      });
    });
  };

  if (!reelId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Reel not found.</Text>
      </View>
    );
  }

  const name = reelItem?.name || `Reel ${reelId}`;

  const accent = '#9cebff';

  const bgImage =
    Math.random() > 0.5
      ? require('../../assets/figma/release-named-blue.png')
      : require('../../assets/figma/release-named-pink.png');

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: cardAnim }}>
        <Image
          source={bgImage}
          style={[styles.creatureImg, { width: W, height: W * 0.55 }]}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.reelName}>"{name}"</Text>

        <Text style={styles.question}>
          Are you sure you want to{'\n'}release this bug-reel?
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.greyButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.blueButton, { backgroundColor: accent }]}
            onPress={handleRelease}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Release</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  creatureImg: {
    alignSelf: 'center',
    marginTop: 60,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
  },

  reelName: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#a7a7a7',
    textAlign: 'center',
  },

  question: {
    fontFamily: 'Dokdo',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 34,
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
  error: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 80,
  },
});