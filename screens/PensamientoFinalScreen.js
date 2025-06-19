import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { estilosBase, colores } from '../styles/theme';

export default function PensamientoFinalScreen() {
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPensamiento = async () => {
      try {
        const ref = doc(db, 'usuarios', auth.currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setTexto(snap.data().pensamientoFinal || '');
        }
      } catch (error) {
        console.error('Error al cargar pensamiento final:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPensamiento();
  }, []);

  const guardarPensamiento = async () => {
    try {
      const ref = doc(db, 'usuarios', auth.currentUser.uid);
      await setDoc(ref, { pensamientoFinal: texto }, { merge: true });
      Alert.alert('✅ Guardado', 'Tu pensamiento final ha sido guardado con éxito.');
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo guardar el pensamiento.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>🕊️ Tu pensamiento final</Text>
      <Text style={styles.subtitulo}>
        Escribe una frase o reflexión que quieras dejar al final de tu libro. Se incluirá en la última hoja con un diseño especial.
      </Text>

      <TextInput
        style={styles.textarea}
        value={texto}
        onChangeText={setTexto}
        placeholder="Ejemplo: “La vida es un regalo que debemos apreciar.”"
        multiline
        numberOfLines={8}
        maxLength={1000}
      />

      <Text style={styles.contador}>{texto.length}/1000 caracteres</Text>

      <Button
        title="Guardar pensamiento final"
        onPress={guardarPensamiento}
        disabled={cargando || texto.trim() === ''}
        color={colores.primario}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 16,
    color: colores.texto,
    marginBottom: 16,
    textAlign: 'center',
  },
  textarea: {
    backgroundColor: '#fff',
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 10,
  },
  contador: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#888',
  },
});
