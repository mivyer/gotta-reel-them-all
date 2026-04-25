import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore, BugReel } from '../../store/useGameStore';
import FigmaHeader from '../../components/FigmaHeader';
import { ReelFrameSmall } from '../../components/ReelFrame';

const { width } = Dimensions.get('window');
const CARD = (width - 48 - 12) / 2;

export default function TradeScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const friends = useGameStore((s) => s.friends);
  const removeReel = useGameStore((s) => s.removeReel);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const friend = friends.find((f) => f.id === friendId);

  const handleSend = () => {
    if (!selectedId) return;
    removeReel(selectedId);
    router.replace({ pathname: '/trade/sent', params: { friendUsername: friend?.username ?? 'your friend' } });
  };

  const renderReel = ({ item }: { item: BugReel }) => {
    const accent = '#9cebff';
    const selected = selectedId === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: selected ? accent : '#e8e8e8' }]}
        onPress={() => setSelectedId(selected ? null : item.id)}
        activeOpacity={0.8}
      >
        <ReelFrameSmall videoUrl={item.videoUrl}/>
        <Text style={styles.cardName} numberOfLines={1}>{item.name !== 'Unknown Reel' ? item.name : 'Unnamed'}</Text>
        <View style={[styles.colorDot, { backgroundColor: accent }]} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FigmaHeader
        title="TRADE"
        subtitle={friend ? `→ ${friend.username}` : undefined}
        onBack={() => router.back()}
      />
      {reels.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No reels to trade</Text>
          <Text style={styles.emptyBody}>Catch some reels first!</Text>
          <TouchableOpacity style={styles.catchBtn} onPress={() => router.push('/catch')}>
            <Text style={styles.catchBtnText}>Go Catch One</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.prompt}>Select a reel to send:</Text>
          <FlatList
            data={reels}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={renderReel}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.sendBtn, !selectedId && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!selectedId}
            >
              <Text style={[styles.sendBtnText, !selectedId && styles.sendBtnTextDisabled]}>Send Reel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  prompt: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7', paddingHorizontal: 20, paddingTop: 12 },
  grid: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  card: { width: CARD, borderRadius: 12, borderWidth: 2, backgroundColor: '#f8f8f8', alignItems: 'center', padding: 12, gap: 6 },
  cardName: { fontFamily: 'Agdasima', fontSize: 14, color: '#000000' },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  footer: { padding: 20, gap: 12 },
  sendBtn: { backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#e8e8e8' },
  sendBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  sendBtnTextDisabled: { color: '#a7a7a7' },
  cancelText: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7', textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
  emptyBody: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7' },
  catchBtn: { backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32 },
  catchBtnText: { fontFamily: 'Agdasima', fontSize: 18, color: '#000000' },
});
