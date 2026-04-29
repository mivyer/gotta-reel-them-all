import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Modal, TouchableOpacity,
  Animated, Dimensions, ScrollView,
  Button, TextInput,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH } from '../../services/firebase';
import { NavigationProp } from '@react-navigation/native';
import { useGameStore } from '../../store/useGameStore';
import { LinearGradient } from 'expo-linear-gradient';


const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;
const CANVAS_H = H * 3;

// ── Checkpoint config ─────────────────────────────────────────────────────────
var NEXT_CHECKPOINT = 500; // first reel-catch trigger
const START_STEPS = 0; // hardcoded launch value — swap for pedometer later

// ── Path waypoints (symmetric S-curve) ───────────────────────────────────────
const WAYPOINTS = [
  { steps: 0, fx: 0.50, fy: 0.97 },
  { steps: 500, fx: 0.75, fy: 0.87 },
  { steps: 1000, fx: 0.25, fy: 0.77 },
  { steps: 1500, fx: 0.75, fy: 0.67 },
  { steps: 2000, fx: 0.25, fy: 0.57 },
  { steps: 2500, fx: 0.75, fy: 0.47 },
  { steps: 3000, fx: 0.25, fy: 0.37 },
  { steps: 3500, fx: 0.75, fy: 0.27 },
  { steps: 4000, fx: 0.25, fy: 0.17 },
  { steps: 4500, fx: 0.75, fy: 0.10 },
  { steps: 5000, fx: 0.50, fy: 0.03 },
];
const CIRCLES = WAYPOINTS.slice(1);

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getPosForSteps(steps: number): { x: number; y: number } {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const from = WAYPOINTS[i];
    const to = WAYPOINTS[i + 1];
    if (steps >= from.steps && steps < to.steps) {
      const t = (steps - from.steps) / (to.steps - from.steps);
      return {
        x: lerp(from.fx, to.fx, t) * W,
        y: lerp(from.fy, to.fy, t) * CANVAS_H,
      };
    }
  }
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  return { x: last.fx * W, y: last.fy * CANVAS_H };
}

// ── SVG path ──────────────────────────────────────────────────────────────────
const p = (fx: number, fy: number) => `${fx * W} ${fy * CANVAS_H}`;
const PATH_D = [
  `M ${p(0.50, 0.97)}`,
  `C ${p(0.65, 0.94)} ${p(0.80, 0.90)} ${p(0.75, 0.87)}`,
  `C ${p(0.68, 0.83)} ${p(0.32, 0.80)} ${p(0.25, 0.77)}`,
  `C ${p(0.18, 0.73)} ${p(0.68, 0.70)} ${p(0.75, 0.67)}`,
  `C ${p(0.82, 0.63)} ${p(0.32, 0.60)} ${p(0.25, 0.57)}`,
  `C ${p(0.18, 0.53)} ${p(0.68, 0.50)} ${p(0.75, 0.47)}`,
  `C ${p(0.82, 0.43)} ${p(0.32, 0.40)} ${p(0.25, 0.37)}`,
  `C ${p(0.18, 0.33)} ${p(0.68, 0.30)} ${p(0.75, 0.27)}`,
  `C ${p(0.82, 0.23)} ${p(0.32, 0.20)} ${p(0.25, 0.17)}`,
  `C ${p(0.18, 0.13)} ${p(0.65, 0.10)} ${p(0.75, 0.10)}`,
  `C ${p(0.82, 0.09)} ${p(0.55, 0.04)} ${p(0.50, 0.03)}`,
].join(' ');

const AVATAR_SIZE = 80;
const CIRCLE_W = 90;
const CIRCLE_H = 55;


interface RouteProps {
  navigation: NavigationProp<any, any>;
}

export default function HomeScreen({ navigation }: RouteProps) {
  const router = useRouter();

  const steps = useGameStore((state) => state.steps);
  const setSteps = useGameStore((state) => state.setSteps);
  const incrementSteps = useGameStore((state) => state.incrementSteps);

  const initPos = getPosForSteps(START_STEPS);
  const animX = useRef(new Animated.Value(initPos.x)).current;
  const animY = useRef(new Animated.Value(initPos.y)).current;

  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const [animating, setAnimating] = useState(false);
  const [numStepsEntered, setNumStepsEntered] = useState(0);
  const [inputText, setInputText] = useState('');

  // Add a ref to auto-scroll to the avatar
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to follow the avatar as it moves
  useEffect(() => {
    const listenerId = animY.addListener(({ value }) => {
      scrollRef.current?.scrollTo({
        y: value - H / 2,  // keep avatar centered vertically
        animated: false,
      });
    });
    return () => animY.removeListener(listenerId);
  }, []);

  useEffect(() => {
    if (!animating) return;

    const endPos = getPosForSteps(NEXT_CHECKPOINT);
    const duration = 4000;

    Animated.parallel([
      Animated.timing(animX, { toValue: endPos.x, duration, useNativeDriver: false }),
      Animated.timing(animY, { toValue: endPos.y, duration, useNativeDriver: false }),
    ]).start(({ finished }) => {
      if (finished) {
        setAnimating(false);
        setModalVisible(true); // ← open modal only after animation completes
      }
    });

    const totalSteps = NEXT_CHECKPOINT - useGameStore.getState().steps;
    const intervalMs = 80;
    const stepsPerTick = Math.ceil(totalSteps / (duration / intervalMs));
    const interval = setInterval(() => {
      const currentSteps = useGameStore.getState().steps; // read outside React
      const next = Math.min(currentSteps + stepsPerTick, NEXT_CHECKPOINT);
      setSteps(next); // writes to store
      if (next >= NEXT_CHECKPOINT) clearInterval(interval);
    }, intervalMs);


    return () => clearInterval(interval);
  }, [animating]);

  // useEffect(() => {
  //   if (steps >= NEXT_CHECKPOINT) {
  //     setModalVisible(true); // Open popup modal
  //     // const t = setTimeout(() => router.push('./catching-screen'), 600);
  //     //return () => clearTimeout(t); TODO
  //   }
  // }, [steps]);
  useEffect(() => {
  if (animating) return; // ← don't override the animation
  const pos = getPosForSteps(steps);
  animX.setValue(pos.x);
  animY.setValue(pos.y);
}, [steps, animating]);

  useEffect(() => {
    // small timeout lets the ScrollView finish laying out before scrolling
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleConfirmCatch = () => {
    setModalVisible(false);
    setModalMode("actions");
    NEXT_CHECKPOINT += 500
    // navigate to catcing screen
    router.replace('/catch');
  };

  const handleStepsEntered = (stepsValue: number) => {
    setSteps(stepsValue); // now writes to the store
    if (stepsValue >= NEXT_CHECKPOINT) {
      setAnimating(true);
    }
  };


  // State to control modal (aka pop-up) visibility
  const [modalMode, setModalMode] = useState<"actions" | "confirmCatch">("actions");
  const [modalVisible, setModalVisible] = useState(false);


  const [modal2Visible, setModal2Visible] = useState(false);



  return (
    <LinearGradient colors={['#22c0ff', '#b9eeff']} style={styles.container}>
    
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ width: W, height: CANVAS_H }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {/* Squiggly dashed path */}
        <Svg width={W} height={CANVAS_H} pointerEvents="none">
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
              top: cp.fy * CANVAS_H - CIRCLE_H / 2,
            }]}
          >
            <Text style={styles.circleText}>{cp.steps.toLocaleString()}</Text>
          </View>
        ))}

        {/* Avatar */}
        <Animated.View
          style={[
            styles.avatarOuter,
            {
              left: Animated.subtract(animX, AVATAR_SIZE / 2),
              top: Animated.subtract(animY, AVATAR_SIZE / 2),
            },
          ]}
        >
          <Animated.View style={{ transform: [{ translateY: bounce }] }}>
            <Image
              source={require('../../assets/figma/profile-icon-small.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
            <Text style={styles.flag}>🚩</Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Step count */}
      <View style={[styles.stepBlock, { pointerEvents: 'none' }]}>
        <Text style={styles.stepNumber}>{steps.toLocaleString()}</Text>
        <Text style={styles.stepLabel}>stePs</Text>
      </View>

      {/* POP-UP MODAL FOR CATCH CONFIRMATION */}
      <Modal
        visible={modalVisible} // Controls visibility
        transparent={true} // Makes background dim
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> You've reached a new checkpoint!</Text>
            {/* <Image
              source={require("../../assets/images/checkpoint-background.png")}
              style={styles.backgroundImage}/> */}

            <Text style={styles.stepCountPopup}> {NEXT_CHECKPOINT} </Text>

            <Text style={{ fontFamily: "Dokdo", fontSize: 20, textAlign: "center" }}> {"\n"} A swarm of bug-reels {"\n"}approaches... </Text>
            {modalMode === "actions" && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>No reels for me...</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.blueButton}
                  onPress={handleConfirmCatch}>
                  <Text style={styles.buttonText}>Catch 'em!</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal >

      {/* Enter Steps Modal*/}
      <Modal
        visible={modal2Visible}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Number of Steps</Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                width: '80%',
                fontFamily: 'Agdasima',
                fontSize: 32,
                textAlign: 'center',
                marginVertical: 16,
              }}
              keyboardType="number-pad"
              placeholder="0"
              value={inputText}
              onChangeText={(text) => setInputText(text.replace(/[^0-9]/g, ''))} // only allows integers
            />

            {modalMode === "actions" && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.greyButton}
                  onPress={() => {
                    setModal2Visible(false);
                    setInputText(''); // reset input on cancel
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.blueButton}
                  onPress={() => {
                    const parsed = parseInt(inputText, 10);
                    if (!isNaN(parsed)) {
                      console.log(parsed)
                      setNumStepsEntered(parsed);
                      console.log(numStepsEntered)
                      setModal2Visible(false);
                      handleStepsEntered(parsed);
                      setInputText(''); // reset after confirm
                    }
                  }}>
                  <Text style={styles.buttonText}>I pinky promise I walked this much...</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarBtn} onPress={() => setModal2Visible(true)}>
          <Text style={styles.startWalkingLabel}>Start Walking</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()} style={styles.topBarBtn}>
          <Text style={styles.startWalkingLabel}>Logout</Text>
        </TouchableOpacity>


      </View>


    </View>
</LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1},

  stepBlock: {
    position: 'absolute',
    left: 0, right: 0,
    top: H * 0.30,
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: 'Dokdo',
    fontSize: 100,
    color: '#ffffff',
    lineHeight: 104,
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  stepLabel: {
    fontFamily: 'Dokdo',
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
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
  },

  avatarOuter: { position: 'absolute', width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE },
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
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    marginHorizontal:-100, // fixing border empty space
    justifyContent: "center", // Center modal vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "rgba(0,0,0,0.5)" // Dark overlay
  },
  modalContent: {
    width: "50%",
    flex:0.7,
    height: "80%",
    backgroundColor: "white",
    alignItems: "center",
    padding: -2,
    borderRadius: 0,
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: "Dokdo",
    fontSize: 35,
    textAlign: "center"
  },
  backgroundImage: {
    paddingTop: 20,
    width: "80%",
    height: "60%"
  },
  stepCountPopup: {
    fontFamily: "Dokdo",
    fontSize: 100,
    textAlign: "center"
  },
  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  blueButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#9DEBFF",
    borderRadius: 8,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    verticalAlign : "middle",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  closeX: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  startWalking: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  startWalkingLabel: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    textAlign: "center",
    color: 'black',
  },
  logoutBtn: {
    position: 'absolute',
    top: 48,
    right: 16,
    padding: 12,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,
  },
  topBarBtn: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});