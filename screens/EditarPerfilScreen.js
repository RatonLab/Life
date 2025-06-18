import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { estilosBase, colores } from '../styles/theme';

export default function EditarPerfilScreen() {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const usuarioId = auth.currentUser?.uid;

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const docRef = doc(db, 'usuarios', usuarioId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setNombre(snap.data().nombre || '');
        }
      } catch (e) {
        console.error('Error al cargar perfil:', e);
      }
    };

    cargarPerfil();
  }, []);

  const guardarPerfil = async () => {
    if (!nombre.trim()) {
      Alert.alert('⚠️ Campo vacío', 'Debes ingresar un nombre.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'usuarios', usuarioId),
        { nombre: nombre.trim() },
        { merge: true }
      );
      Alert.alert('✅ Perfil actualizado', 'Tu nombre se ha guardado correctamente.');
      navigation.goBack();
    } catch (e) {
      console.error('Error actualizando perfil:', e);
      Alert.alert('❌ Error', 'No se pudo actualizar tu perfil.');
    }
  };

  return (
    <View style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📝 Editar perfil</Text>

      <TextInput
        placeholder="Escribe tu nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TouchableOpacity style={estilosBase.boton} onPress={guardarPerfil}>
        <Text style={estilosBase.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
