import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FigmaHeader from '../../components/FigmaHeader';

export default function SentReelScreen() {
  const { friendUsername } = useLocalSearchParams<{ friendUsername: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/figma/trade-sent-blue.png')} style={styles.bgHint} resizeMode="cover" />
      <FigmaHeader title="SENT!" onBack={() => router.replace('../screens/friends')} />
      <View style={styles.content}>
        <Text style={styles.sentTitle}>Reel Sent!</Text>
        <Text style={styles.sentSub}>You sent a reel to</Text>
        <Text style={styles.friendName}>{friendUsername ?? 'your friend'}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trade recorded</Text>
          <Text style={styles.cardDetail}>Sent at {new Date().toLocaleTimeString()}</Text>
          <Text style={styles.cardDetail}>Recipient: {friendUsername ?? 'your friend'}</Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('../screens/inventory')}
        >
          <Text style={styles.btnText}>Go to Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('../screens/friends')}>
          <Text style={styles.cancelText}>Back to Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  bgHint: { position: 'absolute', top: 0, left: 0, right: 0, height: 220, opacity: 0.08 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  sentTitle: { fontFamily: 'Dokdo', fontSize: 64, color: '#000000' },
  sentSub: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7' },
  friendName: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
  card: {
    width: '100%', backgroundColor: '#f8f8f8', borderRadius: 16,
    padding: 20, gap: 6, marginVertical: 8,
  },
  cardLabel: { fontFamily: 'Dokdo', fontSize: 22, color: '#000000' },
  cardDetail: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7' },
  btn: { width: '100%', backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  cancelText: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7', textAlign: 'center', paddingVertical: 8 },
});
