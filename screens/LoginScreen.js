import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { colores, estilosBase } from '../styles/theme';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guardarPassword, setGuardarPassword] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    const cargarCredenciales = async () => {
      const emailGuardado = await AsyncStorage.getItem('email');
      const passGuardada = await AsyncStorage.getItem('password');
      if (emailGuardado && passGuardada) {
        setEmail(emailGuardado);
        setPassword(passGuardada);
        setGuardarPassword(true);
      }
    };
    cargarCredenciales();
  }, []);

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (guardarPassword) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas o problema de conexión.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Iniciar sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputPasswordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
        />
        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Feather
            name={mostrarPassword ? 'eye' : 'eye-off'}
            size={22}
            color={colores.secundario}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setGuardarPassword(!guardarPassword)}
        activeOpacity={0.7}
      >
        <AntDesign
          name={guardarPassword ? 'checksquare' : 'checksquareo'}
          size={24}
          color={guardarPassword ? colores.primario : colores.borde}
        />
        <Text style={styles.checkboxLabel}>Guardar contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilosBase.boton} onPress={handleLogin}>
        <Text style={estilosBase.botonTexto}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    ...estilosBase.contenedor,
    justifyContent: 'center',
  },
  titulo: {
    ...estilosBase.titulo,
    fontSize: 28,
    marginBottom: 20,
  },
  label: {
    ...estilosBase.texto,
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: colores.texto,
  },
  link: {
    marginTop: 12,
    color: colores.acento,
    textAlign: 'center',
    fontSize: 16,
  },
});
