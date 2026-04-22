import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, View } from 'react-native';

import BugReel1 from "../../components/bug-reel1";
import BugReel2 from "../../components/bug-reel2";

//net



type Bug = {
  id: number;
  x: number;
  y: number;
  caught: boolean;
};

//net movement
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

//for net positioning
const { width, height } = Dimensions.get('window');
const END_POSITION_X = 0;
const END_POSITION_Y = 225;


const netheld = false;

const NET_SIZE = 80;   // size of the net hitbox
const BUG_SIZE = 60;  

function isOverlapping(netX: number, netY: number, bugX: number, bugY: number) {
  // check if net and bug boxes overlap
  return (
    netX < bugX + BUG_SIZE &&
    netX + NET_SIZE > bugX &&
    netY < bugY + BUG_SIZE &&
    netY + NET_SIZE > bugY
  );
}

export default function CatchPage() {

    //bug spawn
  const router = useRouter();
    const [bugs, setBugs] = useState<Bug[]>([
      { id: 1, x: width * 0.2, y: height * 0.3, caught: false },
      { id: 2, x: width * 0.6, y: height * 0.6, caught: false },
    ]);
  
  // bugs move around
   useEffect(() => {
     const interval = setInterval(() => {
       setBugs(prev => prev.map(bug => {
         if (bug.caught) return bug;
         return {
           ...bug,
           x: Math.min(width - BUG_SIZE,  Math.max(0, bug.x + (Math.random() - 0.5) * 150)),
           y: Math.min(height - BUG_SIZE, Math.max(0, bug.y + (Math.random() - 0.5) * 150)),
         };
       }));
     }, 600);
     return () => clearInterval(interval);
   }, []);


// net position
  const [netPos, setNetPos] = useState({ x: width * 0.5, y: height * 0.5 });

  // use a ref for bugs so the PanResponder can access latest values
  const bugsRef = useRef(bugs);
  bugsRef.current = bugs;

  // drag the net with your finger
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const netheld = true;
        const newX = gesture.moveX - NET_SIZE / 2;
        const newY = gesture.moveY - NET_SIZE / 2;
        setNetPos({ x: newX, y: newY });

        // check collision with each bug
        bugsRef.current.forEach(bug => {
          if (netheld && !bug.caught && isOverlapping(newX, newY, bug.x, bug.y)) {
            setBugs(prev => prev.map(b =>
              b.id === bug.id ? { ...b, caught: true } : b
            ));
            router.push(`/catch-popup?bugId=${bug.id}`);
          }
        });
      },
    })
  ).current;

/*
    .onEnd((e) => { //default to certain spot
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
    */
    



  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* bugs */}
      {bugs.map((bug, i) => (
        !bug.caught && (
          <View key={bug.id} style={[styles.bug, { left: bug.x, top: bug.y }]}>
            {i === 0 ? <BugReel1 /> : <BugReel2 />}
          </View>
        )
      ))}

      {/* net */}
        <Image
        source={require('../../assets/bugnet.png')}
        style={[styles.netcontainer, { left: netPos.x, top: netPos.y }]}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  bug: {
    position: 'absolute',
    resizeMode:'contain'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : '#3cb1ff'
  },
  netcontainer: {
    position: 'absolute',
    width: 80,
    height: 100,
    zIndex: 10,
    resizeMode:'contain'
  },
});