import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { colores, estilosBase } from '../styles/theme';
import { Feather } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Crear cuenta</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="ejemplo@correo.com"
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputPasswordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
          placeholder="Mínimo 6 caracteres"
        />
        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Feather
            name={mostrarPassword ? 'eye' : 'eye-off'}
            size={22}
            color={colores.secundario}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={estilosBase.boton} onPress={handleRegister}>
        <Text style={estilosBase.botonTexto}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    textAlign: 'center',
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
  link: {
    marginTop: 12,
    color: colores.acento,
    textAlign: 'center',
    fontSize: 16,
  },
});
