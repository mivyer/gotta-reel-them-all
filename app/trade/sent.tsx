import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SentReelScreen() {
  const { friendUsername, reelName, tradeId } = useLocalSearchParams<{
    friendUsername: string;
    reelName: string;
    tradeId: string;
  }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Blue gradient background */}
      <View style={styles.bgTop} />

      <View style={styles.content}>
        {/* Flying bug illustration */}
        <Image
          source={require('../../assets/figma/trade-sent-blue.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.mainText}>You sent the bug reel!</Text>
        <Text style={styles.byeText}>Bye-Bye!</Text>

        {/* Trade receipt */}
        <View style={styles.receipt}>
          <Text style={styles.receiptLabel}>Sent to</Text>
          <Text style={styles.receiptValue}>{friendUsername ?? 'your friend'}</Text>
          {reelName ? (
            <>
              <Text style={styles.receiptLabel}>Reel</Text>
              <Text style={styles.receiptValue}>"{reelName}"</Text>
            </>
          ) : null}
          {tradeId ? (
            <>
              <Text style={styles.receiptLabel}>Trade ID</Text>
              <Text style={styles.receiptId}>{tradeId}</Text>
            </>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/screens/inventory')}
        >
          <Text style={styles.btnText}>Go to Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/screens/friends')}>
          <Text style={styles.cancelText}>Back to Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9f6ff' },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#9cebff',
    opacity: 0.4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  illustration: {
    width: 240,
    height: 240,
    marginBottom: 8,
  },
  mainText: {
    fontFamily: 'Dokdo',
    fontSize: 32,
    color: '#000000',
    textAlign: 'center',
  },
  byeText: {
    fontFamily: 'Dokdo',
    fontSize: 48,
    color: '#000000',
    textAlign: 'center',
  },
  receipt: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 4,
    marginTop: 8,
  },
  receiptLabel: {
    fontFamily: 'Agdasima',
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  receiptValue: {
    fontFamily: 'Dokdo',
    fontSize: 22,
    color: '#000000',
    marginBottom: 6,
  },
  receiptId: {
    fontFamily: 'Agdasima',
    fontSize: 12,
    color: '#aaa',
    marginBottom: 6,
  },
  btn: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  cancelText: {
    fontFamily: 'Agdasima',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
