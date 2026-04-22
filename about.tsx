import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get('screen');
const END_POSITION_X = 0;
const END_POSITION_Y = 200;


export default function App() {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(200);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(200);
  const atDefault = useSharedValue(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
        //how close to the edge of the screen can the net go?
      const maxTranslateX = width / 2 - 100; 
      const maxTranslateY = height / 2 - 200;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd((e) => { //default to certain spot..? help
      if (translationX.value > END_POSITION_X / 2) {
        translationX.value = withTiming(END_POSITION_X, { duration: 1500 });
        atDefault.value = false;
      } else {
        translationX.value = withTiming(END_POSITION_X, { duration: 1500 });
        atDefault.value = true;
      }

      if (translationY.value > END_POSITION_Y / 2) {
        translationY.value = withTiming(END_POSITION_Y, { duration: 900 });
        atDefault.value = false;
      } else {
        translationY.value = withTiming(END_POSITION_Y, { duration: 900 });
        atDefault.value = true;
      }
    })
    .runOnJS(true);
    

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.Image 
            source={require('../../assets/bugnet.png')} 
            style={[animatedStyles,styles.netcontainer]}>
        </Animated.Image>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#467291'
  },
  netcontainer: {
    width: 200,
    height: 200,
    borderRadius: 0,
    resizeMode:'contain'
  },
});
