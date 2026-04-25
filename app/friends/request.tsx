import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import FigmaHeader from '../../components/FigmaHeader';

export default function SendFriendRequestScreen() {
  const router = useRouter();
  const addFriend = useGameStore((s) => s.addFriend);
  const friends = useGameStore((s) => s.friends);

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSend = () => {
    const trimmed = username.trim();
    if (!trimmed) { setError('Enter a username.'); shake(); return; }
    if (trimmed.length < 3) { setError('At least 3 characters.'); shake(); return; }
    if (friends.some((f) => f.username.toLowerCase() === trimmed.toLowerCase())) {
      setError('Already friends!'); shake(); return;
    }
    setError('');
    addFriend({ id: `friend-${Date.now()}`, username: trimmed, reels: [] });
    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <FigmaHeader title="Add Friend" onBack={() => router.replace('/screens/friends')} />
        <View style={styles.successContent}>
          <Text style={styles.successTitle}>Sent!</Text>
          <Text style={styles.successSub}>Friend request sent to</Text>
          <Text style={styles.successName}>{username.trim()}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/screens/friends')}>
            <Text style={styles.btnText}>Back to Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/figma/friends-request.png')} style={styles.bgHint} resizeMode="cover" />
      <FigmaHeader title="Add Friend" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.label}>Enter their username:</Text>
          <Animated.View style={[styles.inputBox, { transform: [{ translateX: shakeAnim }], borderColor: error ? '#ff7ac1' : '#9cebff' }]}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(t) => { setUsername(t); if (error) setError(''); }}
              placeholder="username"
              placeholderTextColor="#a7a7a7"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </Animated.View>
          {!!error && <Text style={styles.errorMsg}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleSend}>
            <Text style={styles.btnText}>Send Request</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  bgHint: { position: 'absolute', top: 0, left: 0, right: 0, height: 220, opacity: 0.08 },
  content: { flex: 1, padding: 24, gap: 16, paddingTop: 40 },
  label: { fontFamily: 'Dokdo', fontSize: 28, color: '#000000' },
  inputBox: { borderWidth: 2, borderRadius: 12, backgroundColor: '#f8f8f8', paddingHorizontal: 16 },
  input: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000', paddingVertical: 14 },
  errorMsg: { fontFamily: 'Agdasima', fontSize: 14, color: '#ff7ac1' },
  btn: { backgroundColor: '#9cebff', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: 'Agdasima', fontSize: 20, color: '#000000' },
  cancelText: { fontFamily: 'Agdasima', fontSize: 16, color: '#a7a7a7', textAlign: 'center', paddingVertical: 8 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  successTitle: { fontFamily: 'Dokdo', fontSize: 64, color: '#000000' },
  successSub: { fontFamily: 'Agdasima', fontSize: 18, color: '#a7a7a7' },
  successName: { fontFamily: 'Dokdo', fontSize: 32, color: '#000000' },
});
