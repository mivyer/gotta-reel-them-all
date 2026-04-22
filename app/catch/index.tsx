import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, View } from 'react-native';

import BugReel1 from '@/components/bug-reel1';
import BugReel2 from '@/components/bug-reel2';

type Bug = {
  id: number;
  x: number;
  y: number;
  caught: boolean;
};

const { width, height } = Dimensions.get('window');
const NET_SIZE = 80;
const BUG_SIZE = 60;

function isOverlapping(netX: number, netY: number, bugX: number, bugY: number) {
  return (
    netX < bugX + BUG_SIZE &&
    netX + NET_SIZE > bugX &&
    netY < bugY + BUG_SIZE &&
    netY + NET_SIZE > bugY
  );
}

export default function CatchPage() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [bugs, setBugs] = useState<Bug[]>([
    { id: 1, x: width * 0.2, y: height * 0.3, caught: false },
    { id: 2, x: width * 0.6, y: height * 0.6, caught: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBugs(prev => prev.map(bug => {
        if (bug.caught) return bug;
        return {
          ...bug,
          x: Math.min(width - BUG_SIZE, Math.max(0, bug.x + (Math.random() - 0.5) * 150)),
          y: Math.min(height - BUG_SIZE, Math.max(0, bug.y + (Math.random() - 0.5) * 150)),
        };
      }));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const [netPos, setNetPos] = useState({ x: width * 0.5, y: height * 0.5 });
  const bugsRef = useRef(bugs);
  bugsRef.current = bugs;

  // track already-caught bugs to prevent duplicate navigations
  const caughtRef = useRef<Set<number>>(new Set());

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = gesture.moveX - NET_SIZE / 2;
        const newY = gesture.moveY - NET_SIZE / 2;
        setNetPos({ x: newX, y: newY });

        bugsRef.current.forEach(bug => {
          if (!caughtRef.current.has(bug.id) && isOverlapping(newX, newY, bug.x, bug.y)) {
            caughtRef.current.add(bug.id);
            setBugs(prev => prev.map(b => b.id === bug.id ? { ...b, caught: true } : b));
            routerRef.current.push(`/catch/catch-popup?bugId=${bug.id}`);
          }
        });
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {bugs.map((bug, i) => (
        !bug.caught && (
          <View key={bug.id} style={[styles.bug, { left: bug.x, top: bug.y }]}>
            {i === 0 ? <BugReel1 /> : <BugReel2 />}
          </View>
        )
      ))}

      <Image
        source={require('./bugnet.png')}
        style={[styles.net, { left: netPos.x, top: netPos.y }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3cb1ff',
  },
  bug: {
    position: 'absolute',
  },
  net: {
    position: 'absolute',
    width: 80,
    height: 100,
    zIndex: 10,
    resizeMode: 'contain',
  },
});
