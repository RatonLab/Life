import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const user = getAuth().currentUser;
      if (user) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 4000); // espera 4 segundos antes de redirigir

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitulo}>Tu historia merece ser contada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce8cc', // color cálido y suave
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 28, // letra más grande y clara
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
