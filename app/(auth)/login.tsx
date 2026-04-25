import {View, Button, Text, TextInput, StyleSheet} from 'react-native';
import { FIREBASE_AUTH } from '../../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAvoidingView } from 'react-native-web';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async() => {
        setLoading(true);
        try{
            const response = await signInWithEmailAndPassword(auth, username, password);
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
        try{
            const response = await createUserWithEmailAndPassword(auth, username, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style = {styles.container}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={100}>
                <TextInput value={username} style={styles.input} placeholder = 'Username' autoCapitalize='none'
                onChangeText={(text) => setUsername(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder = 'Password' autoCapitalize='none'
                onChangeText={(text) => setPassword(text)}></TextInput>
                
                {loading ? 
                (<ActivityIndicator size='large' color = "#9DEBFF" />
                ) : (
                <>
                <Button title = "Login" onPress={signIn} />
                <Button title = "Create Account" onPress={signUp} />
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
    }
});