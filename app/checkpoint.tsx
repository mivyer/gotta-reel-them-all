import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/useGameStore';

export default function CheckpointScreen() {
  const router = useRouter();
  const setCheckpoint = useGameStore((s) => s.setCheckpoint);

  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = () => {
    setCheckpoint(false);
    router.replace('/catch');
  };

  const handleDismiss = () => {
    setCheckpoint(false);
    router.back();
  };

  return (
    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={require('@/assets/figma/checkpoint.png')} style={styles.bgHint} resizeMode="cover" />
        <View style={styles.inner}>
          <Text style={styles.title}>CHECKPOINT!</Text>
          <Text style={styles.subtitle}>A bug-reel is nearby.</Text>
          <Text style={styles.description}>
            You've reached a special spot.{'\n'}Catch a bug-reel now!
          </Text>

          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start Catching!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#9cebff',
  },
  bgHint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 },
  inner: { padding: 32, alignItems: 'center', gap: 12 },
  title: { fontFamily: 'Dokdo_400Regular', fontSize: 48, color: '#000000', textAlign: 'center' },
  subtitle: { fontFamily: 'Agdasima_400Regular', fontSize: 20, color: '#000000' },
  description: {
    fontFamily: 'Agdasima_400Regular', fontSize: 16, color: '#000000',
    textAlign: 'center', lineHeight: 24, marginBottom: 8,
  },
  startBtn: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  startBtnText: { fontFamily: 'Agdasima_400Regular', fontSize: 20, color: '#000000' },
  dismissText: { fontFamily: 'Agdasima_400Regular', fontSize: 16, color: '#000000', paddingVertical: 8 },
});
