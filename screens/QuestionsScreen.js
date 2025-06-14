import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import preguntasPorEtapa from '../utils/preguntasPorEtapa';

export default function QuestionsScreen({ route }) {
  const { etapa } = route.params;
  const uid = auth.currentUser.uid;
  const db = getFirestore();

  const preguntas = preguntasPorEtapa[etapa] || [];

  const [respuestas, setRespuestas] = useState({});
  const [estados, setEstados] = useState({});
  const [caracteres, setCaracteres] = useState({});

  // Cargar respuestas previas
  useEffect(() => {
    const cargarRespuestasGuardadas = async () => {
      let nuevasRespuestas = {};
      let nuevosEstados = {};
      let nuevosCaracteres = {};

      for (const preg of preguntas) {
        const docId = `${uid}_${etapa}_${preg}`;
        const ref = doc(db, 'respuestas', docId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const texto = data.textoRespuesta || '';
          nuevasRespuestas[preg] = texto;
          nuevosCaracteres[preg] = texto.length;
          nuevosEstados[preg] = data.estado === 'omitida' ? '❌ Omitida' : '✅ Respondida';
        } else {
          nuevosEstados[preg] = '⏳ Pendiente';
        }
      }

      setRespuestas(nuevasRespuestas);
      setEstados(nuevosEstados);
      setCaracteres(nuevosCaracteres);
    };

    cargarRespuestasGuardadas();
  }, []);

  const handleChange = (pregunta, texto) => {
    setRespuestas((prev) => ({ ...prev, [pregunta]: texto }));
    setCaracteres((prev) => ({ ...prev, [pregunta]: texto.length }));

    if (texto.trim().length > 0) {
      setEstados((prev) => ({ ...prev, [pregunta]: '✅ Respondida' }));
    } else {
      setEstados((prev) => ({ ...prev, [pregunta]: '⏳ Pendiente' }));
    }
  };

  const guardar = async (pregunta) => {
    const texto = respuestas[pregunta]?.trim();
    if (!texto) {
      Alert.alert('❌ Respuesta vacía', 'Por favor escribe algo o marca como omitida.');
      return;
    }

    const docId = `${uid}_${etapa}_${pregunta}`;
    try {
      await setDoc(doc(db, 'respuestas', docId), {
        usuarioID: uid,
        etapa,
        preguntaId: pregunta,
        textoRespuesta: texto,
        estado: 'respondida',
        fechaModificacion: new Date().toISOString(),
      });
      setEstados((prev) => ({ ...prev, [pregunta]: '✅ Respondida' }));
      Alert.alert('✅ Guardado', 'Tu respuesta fue guardada.');
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar la respuesta.');
    }
  };

  const omitir = async (pregunta) => {
    const docId = `${uid}_${etapa}_${pregunta}`;
    try {
      await setDoc(doc(db, 'respuestas', docId), {
        usuarioID: uid,
        etapa,
        preguntaId: pregunta,
        textoRespuesta: '',
        estado: 'omitida',
        fechaModificacion: new Date().toISOString(),
      });
      setRespuestas((prev) => ({ ...prev, [pregunta]: '' }));
      setEstados((prev) => ({ ...prev, [pregunta]: '❌ Omitida' }));
      setCaracteres((prev) => ({ ...prev, [pregunta]: 0 }));
      Alert.alert('❌ Pregunta omitida');
    } catch (error) {
      console.error('Error al omitir:', error);
      Alert.alert('Error', 'No se pudo omitir la pregunta.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.etapaTitulo}>🧸 Etapa: {etapa}</Text>
      </View>

      {preguntas.map((pregunta, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.pregunta}>{pregunta}</Text>

          <Text
            style={[
              styles.estado,
              {
                color:
                  estados[pregunta] === '✅ Respondida'
                    ? 'green'
                    : estados[pregunta] === '❌ Omitida'
                    ? 'red'
                    : '#888',
              },
            ]}
          >
            {estados[pregunta] || '⏳ Pendiente'}
          </Text>

          <TextInput
            multiline
            numberOfLines={6}
            style={styles.input}
            placeholder="Escribe tu respuesta con calma..."
            value={respuestas[pregunta] || ''}
            onChangeText={(texto) => handleChange(pregunta, texto)}
            textAlignVertical="top"
            maxLength={8000}
          />

          <Text style={styles.contador}>
            {caracteres[pregunta] || 0} / 8000 caracteres
          </Text>

          <View style={styles.botones}>
            <Button
              title="Guardar respuesta"
              onPress={() => guardar(pregunta)}
              color="#007AFF"
            />
            <View style={{ height: 8 }} />
            <Button
              title="Omitir pregunta"
              color="#FF3B30"
              onPress={() =>
                Alert.alert(
                  '¿Omitir esta pregunta?',
                  'Esto marcará la pregunta como omitida.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Omitir', style: 'destructive', onPress: () => omitir(pregunta) },
                  ]
                )
              }
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  header: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
  },
  etapaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pregunta: {
    fontSize: 17,
    marginBottom: 6,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
  },
  contador: {
    fontSize: 13,
    color: '#888',
    textAlign: 'right',
    marginBottom: 8,
  },
  estado: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botones: {
    marginTop: 6,
  },
});
