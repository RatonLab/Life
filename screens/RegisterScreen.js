import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { colores, estilosBase } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [nombreAutor, setNombreAutor] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');

  const registrar = async () => {
    if (!nombreAutor || !email || !clave) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const credenciales = await createUserWithEmailAndPassword(auth, email, clave);

      // Guardar datos del usuario en Firestore, incluyendo el nombre del autor
      await setDoc(doc(db, 'usuarios', credenciales.user.uid), {
        nombre: nombreAutor.trim(),
        correo: email,
        creado: new Date(),
      });

      Alert.alert('✅ Registro exitoso', 'Ya puedes iniciar sesión');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('❌ Error', error.message);
    }
  };

  return (
    <View style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del autor/a"
        value={nombreAutor}
        onChangeText={setNombreAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={clave}
        onChangeText={setClave}
      />

      <TouchableOpacity style={estilosBase.boton} onPress={registrar}>
        <Text style={estilosBase.botonTexto}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={estilosBase.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
