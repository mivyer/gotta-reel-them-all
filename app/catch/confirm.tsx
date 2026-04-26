import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { REELS_DATABASE } from '../../constants/reels-database';
import ReelFrame from '../../components/ReelFrame';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function CatchConfirmScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();

  const inventory = useGameStore((s) => s.inventory);

  const reelItem = inventory.find((r) => r.reelId === reelId);
  const video = REELS_DATABASE[reelId as string];
  const name = reelItem?.name || `Reel ${reelId}`;

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 16,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTap = () => {
    if (!reelId) return;

    router.push({
      pathname: '/reel/view',
      params: {
        reelId: reelId as string,
      },
    });
  };

  if (!reelId) return <View style={styles.container} />;

  const bgImage =
    Math.random() > 0.5
      ? require('../../assets/figma/catch-confirm-blue.png')
      : require('../../assets/figma/catch-confirm-pink.png');

  return (
    <TouchableOpacity style={styles.container} onPress={handleTap} activeOpacity={1}>
      {/* background */}
      <Image source={bgImage} style={styles.bgImage} resizeMode="cover" />

      {/* animated reel */}
      <Animated.View style={[styles.frameWrap, { transform: [{ scale }], opacity }]}>
        <ReelFrame
          videoUrl={video}
          width={W * 0.72}
          height={W * 0.72 * 0.65}
          playing
          muted={false}
        />
      </Animated.View>

      {/* text */}
      <Animated.View style={[styles.textWrap, { opacity }]}>
        <Text style={styles.congratsText}>you caught {name}!</Text>
        <Text style={styles.tapText}>tap anywhere to proceed</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9cebff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  frameWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  congratsText: {
    fontFamily: 'Dokdo',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
  },
  tapText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.6,
  },
});