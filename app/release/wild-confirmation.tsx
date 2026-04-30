import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BUG_REEL_FRAMES } from '../../constants/reels-database';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function WildReleaseConfirmScreen() {
  const router = useRouter();

  const { reelId, video } = useLocalSearchParams();

  const cardAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'actions' | 'confirmRelease'>(
    'actions'
  );

  const handleRelease = () => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setModalMode('actions');

      router.replace({
        pathname: '/release/wild-post',
        params: {},
      });
    });
  };

  const handleOpenRelease = () => {
    setModalVisible(true);
    setModalMode('confirmRelease');
  };

  const accent = '#9cebff';
  const bgImage = BUG_REEL_FRAMES[Math.floor(Math.random() * 4)];

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: cardAnim }}>
        <Image
          source={bgImage}
          style={[styles.creatureImg, { width: W, height: W * 0.55 }]}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.question}>
          Are you sure you want to{'\n'}release the wild bug-reel?
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() =>
              router.push({
                pathname: '/reel/view-from-wild',
                params: {
                  reelId,
                  video,
                },
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.releaseBtn, { backgroundColor: accent }]}
            onPress={handleOpenRelease}
            activeOpacity={0.8}
          >
            <Text style={styles.releaseBtnText}>Release</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {modalMode === 'confirmRelease' && (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.modalText}>
                  Final confirmation:{'\n'}
                  Release this wild bug-reel?
                </Text>

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalRelease, { backgroundColor: accent }]}
                    onPress={handleRelease}
                  >
                    <Text style={styles.modalBtnText}>Release</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  creatureImg: { alignSelf: 'center', marginTop: 60 },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
  },

  question: {
    fontFamily: 'Dokdo',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 34,
  },

  btnRow: { flexDirection: 'row', gap: 14, width: '100%' },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
       paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
  },

  cancelBtnText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
  },

  releaseBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30
  },

  releaseBtnText: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },

  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Agdasima',
  },

  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancel: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },

  modalRelease: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },

  modalBtnText: {
    fontSize: 16,
    fontFamily: 'Agdasima',
    color: '#000',
  },
});