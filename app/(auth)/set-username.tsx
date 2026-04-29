import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH } from "../../services/firebase";
import { DB } from "../../services/firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { useGameStore } from "../../store/useGameStore";

export default function SetUsername() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUser = useGameStore((s) => s.user);

  const setUser = useGameStore((s) => s.setUser);
  const uid = FIREBASE_AUTH.currentUser?.uid;

  const router = useRouter();

  // validation rules
  const validate = (name: string) => {
    const normalized = name.toLowerCase().trim();

    if (normalized.length < 3) return "Username must be at least 3 characters";
    if (normalized.length > 15) return "Username must be under 15 characters";
    if (!/^[a-z0-9_]+$/.test(normalized)) {
      return "Only letters, numbers, and underscores allowed";
    }

    return null;
  };

  const handleSubmit = async () => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) return;

    const normalized = username.toLowerCase().trim();

    const validationError = validate(normalized);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const usernameRef = doc(DB, "usernames", normalized);
      const userRef = doc(DB, "users", uid);

      // TRANSACTION (prevents race conditions)
      await runTransaction(DB, async (transaction) => {
        const usernameDoc = await transaction.get(usernameRef);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found");
        }

        const currentData = userDoc.data();
        const oldUsername = currentData.username;

        // new username already taken
        if (usernameDoc.exists()) {
          throw new Error("Username already taken");
        }

        // remove old username (if it exists and is different)
        if (oldUsername && oldUsername !== normalized) {
          const oldUsernameRef = doc(DB, "usernames", oldUsername);
          transaction.delete(oldUsernameRef);
        }

        // reserve new username
        transaction.set(usernameRef, { uid });

        // update user profile
        transaction.update(userRef, {
          username: normalized,
        });
      });
  
      // success → go to app
      router.replace("/screens");

    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Username</Text>

      <TextInput
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="username"
        autoCapitalize="none"
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#9DEBFF" />
      ) : (
        <TouchableOpacity style={styles.blueButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.greyButton} onPress={() => router.push('/screens/profile')}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Dokdo",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  blueButton: {
    backgroundColor: "#9DEBFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  greyButton: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    fontFamily: "Agdasima",
    fontSize: 20,
  },
});