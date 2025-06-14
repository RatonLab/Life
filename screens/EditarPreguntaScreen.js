import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

export default function EditarPreguntaScreen({ route, navigation }) {
  const { pregunta, idPregunta, etapa, uid, respuestaPrevia = '' } = route.params;

  const db = getFirestore(app);
  const [respuesta, setRespuesta] = useState(respuestaPrevia);
  const [estado, setEstado] = useState('⏳ Pendiente');
  const [palabras, setPalabras] = useState(0);

  useEffect(() => {
    const count = respuesta.trim().split(/\s+/).filter(Boolean).length;
    setPalabras(count);

    if (respuesta.trim().length > 0) {
      setEstado('✅ Respondida');
    } else {
      setEstado('⏳ Pendiente');
    }
  }, [respuesta]);

  const guardar = async (nuevoEstado) => {
    const docId = `${uid}_${etapa}_${pregunta}`;
    const textoGuardar = nuevoEstado === 'omitida' ? '' : respuesta;

    try {
      await setDoc(doc(db, 'respuestas', docId), {
        usuarioID: uid,
        etapa,
        preguntaId: pregunta,
        textoRespuesta: textoGuardar,
        estado: nuevoEstado === 'omitida' ? 'omitida' : 'respondida',
        fechaModificacion: new Date().toISOString(),
      });

      Alert.alert(
        '✅ Guardado',
        nuevoEstado === 'omitida'
          ? 'Pregunta marcada como omitida.'
          : 'Respuesta guardada correctamente.'
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar la respuesta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pregunta}>{pregunta}</Text>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        placeholder="Escribe tu respuesta..."
        value={respuesta}
        onChangeText={setRespuesta}
      />

      <Text style={styles.contador}>📝 {palabras} palabras</Text>
      <Text style={styles.estado}>
        Estado actual:{' '}
        {estado === '✅ Respondida'
          ? '✅ Respondida'
          : estado === 'omitida'
          ? '❌ Omitida'
          : '⏳ Pendiente'}
      </Text>

      <View style={styles.botones}>
        <Button
          title="Guardar respuesta"
          onPress={() => {
            if (!respuesta.trim()) {
              Alert.alert('❌ Respuesta vacía', 'Escribe algo o marca como omitida.');
              return;
            }
            guardar('respondida');
          }}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Omitir pregunta"
          color="red"
          onPress={() =>
            Alert.alert(
              '¿Omitir esta pregunta?',
              'Esta acción marcará la pregunta como omitida.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Omitir', style: 'destructive', onPress: () => guardar('omitida') },
              ]
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  pregunta: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 140,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  contador: { fontSize: 14, color: '#555', marginBottom: 4 },
  estado: { fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  botones: { marginTop: 10 },
});
