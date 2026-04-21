import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

// ── Checkpoint config ─────────────────────────────────────────────────────────
const NEXT_CHECKPOINT = 2500; // first reel-catch trigger
const START_STEPS     = 2163; // hardcoded launch value — swap for pedometer later

// ── Path waypoints (symmetric S-curve) ───────────────────────────────────────
const WAYPOINTS = [
  { steps: 0,    fx: 0.50, fy: 0.97 },
  { steps: 2500, fx: 0.72, fy: 0.70 },
  { steps: 3000, fx: 0.28, fy: 0.46 },
  { steps: 3500, fx: 0.72, fy: 0.10 },
];
const CIRCLES = WAYPOINTS.slice(1);

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getPosForSteps(steps: number): { x: number; y: number } {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const from = WAYPOINTS[i];
    const to   = WAYPOINTS[i + 1];
    if (steps >= from.steps && steps < to.steps) {
      const t = (steps - from.steps) / (to.steps - from.steps);
      return {
        x: lerp(from.fx, to.fx, t) * W,
        y: lerp(from.fy, to.fy, t) * H,
      };
    }
  }
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  return { x: last.fx * W, y: last.fy * H };
}

// ── SVG path ──────────────────────────────────────────────────────────────────
const p = (fx: number, fy: number) => `${fx * W} ${fy * H}`;
const PATH_D = [
  `M ${p(0.50, 0.97)}`,
  `C ${p(0.65, 0.93)} ${p(0.78, 0.82)} ${p(0.72, 0.70)}`,
  `C ${p(0.62, 0.60)} ${p(0.35, 0.52)} ${p(0.28, 0.46)}`,
  `C ${p(0.20, 0.38)} ${p(0.58, 0.18)} ${p(0.72, 0.10)}`,
].join(' ');

const AVATAR_SIZE = 80;
const CIRCLE_W    = 90;
const CIRCLE_H    = 55;

export default function HomeScreen() {
  const router = useRouter();

  const [steps, setSteps] = useState(START_STEPS);

  const initPos = getPosForSteps(START_STEPS);
  const animX = useRef(new Animated.Value(initPos.x)).current;
  const animY = useRef(new Animated.Value(initPos.y)).current;

  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(bounce, { toValue:   0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const endPos = getPosForSteps(NEXT_CHECKPOINT);
    const duration = 4000;
    Animated.parallel([
      Animated.timing(animX, { toValue: endPos.x, duration, useNativeDriver: false }),
      Animated.timing(animY, { toValue: endPos.y, duration, useNativeDriver: false }),
    ]).start();

    const totalSteps = NEXT_CHECKPOINT - START_STEPS;
    const intervalMs = 80;
    const stepsPerTick = Math.ceil(totalSteps / (duration / intervalMs));
    const interval = setInterval(() => {
      setSteps(prev => {
        const next = Math.min(prev + stepsPerTick, NEXT_CHECKPOINT);
        if (next >= NEXT_CHECKPOINT) clearInterval(interval);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (steps >= NEXT_CHECKPOINT) {
      const t = setTimeout(() => router.push('/catch'), 600);
      return () => clearTimeout(t);
    }
  }, [steps]);

  return (
    <View style={styles.container}>

      {/* Squiggly dashed path */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={PATH_D}
          stroke="#5a9bb8"
          strokeWidth={4}
          strokeDasharray="14 12"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Checkpoint circles */}
      {CIRCLES.map((cp) => (
        <View
          key={cp.steps}
          style={[styles.circle, {
            left: cp.fx * W - CIRCLE_W / 2,
            top:  cp.fy * H - CIRCLE_H / 2,
          }]}
        >
          <Text style={styles.circleText}>{cp.steps.toLocaleString()}</Text>
        </View>
      ))}

      {/* Step count */}
      <View style={styles.stepBlock} pointerEvents="none">
        <Text style={styles.stepNumber}>{steps.toLocaleString()}</Text>
        <Text style={styles.stepLabel}>stePs</Text>
      </View>

      {/* Avatar — outer: position; inner: bounce */}
      <Animated.View
        style={[
          styles.avatarOuter,
          {
            left: Animated.subtract(animX, AVATAR_SIZE / 2),
            top:  Animated.subtract(animY, AVATAR_SIZE / 2),
          },
        ]}
      >
        <Animated.View style={{ transform: [{ translateY: bounce }] }}>
          <Image
            source={require('./assets/profile-icon-small.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
          {/* Flag — non-interactive, marks current position */}
          <Text style={styles.flag}>🚩</Text>
        </Animated.View>
      </Animated.View>

      {/* Nav buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.navBtnText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/(tabs)/friends')}>
          <Text style={styles.navBtnText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/(tabs)/inventory')}>
          <Text style={styles.navBtnText}>Inventory</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9cebff' },

  stepBlock: {
    position: 'absolute',
    left: 0, right: 0,
    top: H * 0.30,
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 100,
    color: '#ffffff',
    lineHeight: 104,
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  stepLabel: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 32,
    color: '#000000',
    marginTop: -8,
  },

  circle: {
    position: 'absolute',
    width: CIRCLE_W,
    height: CIRCLE_H,
    borderRadius: CIRCLE_H / 2,
    backgroundColor: '#82d840',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontFamily: 'Agdasima_400Regular',
    fontSize: 20,
    color: '#000000',
  },

  avatarOuter: { position: 'absolute', width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatar:      { width: AVATAR_SIZE, height: AVATAR_SIZE },
  flag: {
    position: 'absolute',
    top: -36,
    right: -18,
    fontSize: 28,
  },

  navRow: {
    position: 'absolute',
    bottom: 24,
    left: 16, right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  navBtnText: {
    fontFamily: 'Agdasima_400Regular',
    fontSize: 18,
    color: '#000000',
  },
});
