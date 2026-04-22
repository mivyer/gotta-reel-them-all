import { useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';

export default function BugReel2() {
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, { toValue: 8, duration: 380, useNativeDriver: true }),
        Animated.timing(wobble, { toValue: -8, duration: 380, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: wobble }] }}>
      <Image
        source={require('@/assets/images/bugreel2.png')}
        style={{ width: 60, height: 60 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
