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
    }, 4000); // ⏱️ Aumentado a 4 segundos

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/logo.png')} // debe tener fondo transparente ahora
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Mi vida en palabras</Text>
      <Text style={styles.subtitulo}>Tu historia merece ser contada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce8cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220, // 📏 más grande
    height: 220,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 32, // 🔠 más grande para personas mayores
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
