import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';


export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/bugnet.png")}></Image>
      <Text style={styles.text}> this is the bugnet catching mechanism test! 
        Currently visual only. :^p
      </Text>
      <Link href="/about" style={styles.button}>
        test the bugnet!!!!!!!
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Agdasima',
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
