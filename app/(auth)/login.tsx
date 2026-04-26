import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, DB} from '../../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const uid = response.user.uid;

            await setDoc(doc(DB, "users", uid), {
                username: null,      // not set yet
                email: email,
                steps: 0,
                inventory: [],
                friends: [],
                activeTrades: {},
                createdAt: Date.now(),
            });

            router.replace("/set-username");
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={100}>
                <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}></TextInput>

                {loading ?
                    (<ActivityIndicator size='large' color="#9DEBFF" />
                    ) : (
                        <>
                            <TouchableOpacity style={styles.blueButton} onPress={signIn}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.greyButton} onPress={signUp}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>
                        </>
                    )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'

    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#ffffff"
    },

    greyButton: {
        padding: 12,
        marginVertical: 5,
        backgroundColor: "#D9D9D9",
        borderRadius: 8
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
});