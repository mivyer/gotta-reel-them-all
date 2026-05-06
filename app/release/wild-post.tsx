import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function WildPostReleaseScreen() {
  const { color } = useLocalSearchParams<{ color: string }>();
  const router = useRouter();
  

  const bgImage =
    Math.random() > 0.5
      ? require('../../assets/images/release-reel0.png')
      : require('../../assets/images/release-reel1.png');

  return (
    <View style={styles.container}>
    <Image
          source={bgImage}
          style={[styles.creatureImg, { width:300 , height: 500 }]}
          resizeMode="contain"
        />      
        <View style={styles.content}>
        <Text style={styles.byeTitle}>Bye-Bye!</Text>
        <Text style={styles.description}>
          You released the{'\n'} wild bug-reel...
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/catch')}
        >
          <Text style={styles.btnText}>Back to Catching!</Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/screens')}
        >
          <Text style={styles.btnText}>I'm done. Let me go home.</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9cebff' },
  creatureImg: {alignSelf: 'center', marginTop: 60 },
    
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'flex-end',
    padding: 32, paddingBottom: 64, gap: 16,
  },
  byeTitle: { fontFamily: 'Dokdo', fontSize: 64, color: '#000000', textAlign: 'center' },
  description: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000', textAlign: 'center', lineHeight: 36 },
  btn: { width: '100%', backgroundColor: '#ffffff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
});
