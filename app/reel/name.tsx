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

  const inventory = useGameStore((s) => s.inventory);
  const renameReel = useGameStore((s) => s.renameReel);
  const addReel = useGameStore((s) => s.addReel);

  const reelItem = inventory.find((r) => r.reelId === reelId);

  const [name, setName] = useState(reelItem?.name || '');
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

  const bugReelFrames = [
    require('../../assets/images/bugreel0.png'),
    require('../../assets/images/bugreel1.png'),
    require('../../assets/images/bugreel2.png'),
    require('../../assets/images/bugreel3.png'),
  ];

  const bgImage =
    bugReelFrames[Math.floor(Math.random() * bugReelFrames.length)];

  const handleSave = () => {
    if (!name.trim()) {
      setError('Enter a name first.');
      shake();
      return;
    }

    if (name.trim().length > 24) {
      setError('Max 24 characters.');
      shake();
      return;
    }

    setError('');

    if (reelId) {
      addReel(reelId);
      renameReel(reelId, name.trim());
    }

    router.push('/screens/inventory');
  };

  if (!reelId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Reel not found.</Text>
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image source={bgImage} style={styles.creatureImg} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.prompt}>Please name the bug-reel.</Text>

        <Animated.View style={[styles.inputBox, { transform: [{ translateX: shakeAnim }] }]}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (error) setError('');
            }}
            placeholder="Type here"
            placeholderTextColor="#a7a7a7"
            maxLength={24}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </Animated.View>

        {!!error && <Text style={styles.errorMsg}>{error}</Text>}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.greyButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blueButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Save</Text>
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

  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
  },
  blueButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#9DEBFF",
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Agdasima",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  error: {
    fontFamily: 'Agdasima',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 80,
  },
});
