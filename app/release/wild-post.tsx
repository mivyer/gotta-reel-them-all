import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function WildPostReleaseScreen() {
  const { color } = useLocalSearchParams<{ color: string }>();
  const router = useRouter();
  const bgImage = require('../../assets/figma/wild-post-blue.png') | require('../../assets/figma/wild-post-pink.png');

  return (
    <View style={styles.container}>
      <Image source={bgImage} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.byeTitle}>Bye-Bye!</Text>
        <Text style={styles.description}>
          You released the{'\n'}bug-reel...
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/(tabs)/inventory')}
        >
          <Text style={styles.btnText}>Back to Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeBtnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9cebff' },
  bgImage: { ...StyleSheet.absoluteFillObject as any, width: '100%', height: '100%', opacity: 0.85 },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'flex-end',
    padding: 32, paddingBottom: 64, gap: 16,
  },
  byeTitle: { fontFamily: 'Dokdo', fontSize: 64, color: '#000000', textAlign: 'center' },
  description: { fontFamily: 'Dokdor', fontSize: 32, color: '#000000', textAlign: 'center', lineHeight: 36 },
  btn: { width: '100%', backgroundColor: '#ffffff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  homeBtn: { paddingVertical: 10 },
  homeBtnText: { fontFamily: 'Agdasima', fontSize: 16, color: '#000000' },
});
