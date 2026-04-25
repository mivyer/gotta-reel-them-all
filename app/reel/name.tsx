import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Image, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';

const W = Platform.OS === 'web' ? 390 : Dimensions.get('window').width;

export default function NameReelScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const router = useRouter();
  const reels = useGameStore((s) => s.reels);
  const nameReel = useGameStore((s) => s.nameReel);

  const reel = reels.find((r) => r.id === reelId);
  const [name, setName] = useState(reel && reel.name !== 'Unknown Reel' ? reel.name : '');
  const [error, setError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = () => {
    if (!name.trim()) { setError('Enter a name first.'); shake(); return; }
    if (name.trim().length > 24) { setError('Max 24 characters.'); shake(); return; }
    setError('');
    if (reelId) nameReel(reelId, name.trim());
    router.push('/(tabs)/inventory');
  };

  if (!reel) return <View style={styles.container}><Text style={styles.error}>Reel not found.</Text></View>;

  const accent = '#9cebff' ;
  const bgImage = require('../../assets/figma/naming-blue.png') | require('../../assets/figma/naming-pink.png');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Figma creature as the visual header */}
      <Image source={bgImage} style={styles.creatureImg} resizeMode="contain" />

      <View style={styles.content}>
        {/* Figma text */}
        <Text style={styles.prompt}>Please name the bug-reel.</Text>

        {/* Input box matching Figma */}
        <Animated.View style={[styles.inputBox, { transform: [{ translateX: shakeAnim }] }]}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(t) => { setName(t); if (error) setError(''); }}
            placeholder="Type here"
            placeholderTextColor="#a7a7a7"
            maxLength={24}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </Animated.View>
        {!!error && <Text style={styles.errorMsg}>{error}</Text>}

        {/* Cancel | Save — matching Figma layout */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: accent }]} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  creatureImg: {
    width: W,
    height: W * 0.55,
    alignSelf: 'center',
    marginTop: 48,
  },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, gap: 20 },

  prompt: {
    fontFamily: 'Dokdo',
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
  },

  inputBox: {
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontFamily: 'Agdasima',
    fontSize: 20,
    color: '#000000',
    paddingVertical: 16,
  },
  errorMsg: { fontFamily: 'Agdasima', fontSize: 14, color: '#ff7ac1', textAlign: 'center' },

  btnRow: { flexDirection: 'row', gap: 14 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  saveBtn: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  error: { fontFamily: 'Agdasima', fontSize: 18, color: '#000', textAlign: 'center', marginTop: 80 },
});
