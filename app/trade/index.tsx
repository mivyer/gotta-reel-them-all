import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore, InventoryItem } from '../../store/useGameStore';
import FigmaHeader from '../../components/FigmaHeader';
import { sendReelToFriend } from '../../services/tradeService';

const { width } = Dimensions.get('window');
const CARD = (width - 48 - 12) / 2;

export default function TradeScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const router = useRouter();
  const inventory = useGameStore((s) => s.inventory);
  const friends = useGameStore((s) => s.friends);
  const user = useGameStore((s) => s.user);
  const releaseReel = useGameStore((s) => s.releaseReel);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);

  const friend = friends.find((f) => f.uid === friendId);
  const selectedReel = inventory.find((r) => r.reelId === selectedId);

  const handleSend = async () => {
    if (!selectedId || !selectedReel || !friend || !user) return;
    setSending(true);
    try {
      await sendReelToFriend(user.uid, friend.uid, selectedReel.reelId, selectedReel.name);
      releaseReel(selectedReel.reelId);
      router.replace({
        pathname: '/trade/sent',
        params: {
          friendUsername: friend.username,
          reelName: selectedReel.name,
        },
      });
    } catch (e) {
      console.error('sendReel error:', e);
      setSending(false);
    }
  };

  const renderReel = ({ item }: { item: InventoryItem }) => {
    const selected = selectedId === item.reelId;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setSelectedId(selected ? null : item.reelId)}
        activeOpacity={0.8}
      >
        <View style={styles.reelPreview}>
          <View style={styles.reelIconBox}>
            <View style={styles.reelIconInner} />
          </View>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name !== 'Unnamed Reel' ? item.name : 'Unnamed'}
        </Text>
        {selected && <View style={styles.colorDot} />}
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

      {inventory.length === 0 ? (
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
            data={inventory}
            keyExtractor={(item) => item.reelId}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={renderReel}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.sendBtn, !selectedId && styles.sendBtnDisabled]}
              onPress={() => setConfirming(true)}
              disabled={!selectedId}
            >
              <Text style={[styles.sendBtnText, !selectedId && styles.sendBtnTextDisabled]}>
                Send Reel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Confirmation modal matching figma */}
      <Modal visible={confirming} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image
              source={require('../../assets/figma/trade-blue.png')}
              style={styles.modalIllustration}
              resizeMode="contain"
            />
            <Text style={styles.modalReelName}>"{selectedReel?.name ?? 'Unnamed'}"</Text>
            <Text style={styles.modalQuestion}>
              Are you sure that you{'\n'}want to send this reel?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setConfirming(false)}
                disabled={sending}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSend]}
                onPress={handleSend}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.modalBtnSendText}>Send Reel</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  prompt: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7', paddingHorizontal: 20, paddingTop: 12 },
  grid: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    width: CARD,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  cardSelected: { borderColor: '#9cebff' },
  reelPreview: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  reelIconBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#d9f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelIconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9cebff',
  },
  cardName: { fontFamily: 'Agdasima', fontSize: 14, color: '#000000' },
  colorDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#9cebff' },
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  modalIllustration: { width: 160, height: 160 },
  modalReelName: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
  modalQuestion: {
    fontFamily: 'Dokdo',
    fontSize: 26,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8, width: '100%' },
  modalBtn: { flex: 1, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#e0e0e0' },
  modalBtnSend: { backgroundColor: '#9cebff' },
  modalBtnCancelText: { fontFamily: 'Agdasima', fontSize: 18, color: '#555' },
  modalBtnSendText: { fontFamily: 'Agdasima', fontSize: 18, color: '#000000' },
});
