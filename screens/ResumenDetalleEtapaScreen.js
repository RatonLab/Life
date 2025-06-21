// screens/ResumenDetalleEtapaScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../firebaseConfig';

const db = getFirestore(app);

export default function ResumenDetalleEtapaScreen({ route }) {
  const { etapa } = route.params;
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    const cargarRespuestas = async () => {
      try {
        const q = query(collection(db, 'respuestas'), where('etapa', '==', etapa));
        const snapshot = await getDocs(q);
        const datos = snapshot.docs.map(doc => doc.data());
        setRespuestas(datos);
      } catch (error) {
        console.error('Error al cargar respuestas:', error);
      }
    };

    cargarRespuestas();
  }, [etapa]);

  const porEstado = (estado) => respuestas.filter(r => r.estado === estado);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{etapa}</Text>

      <Text style={styles.subtitulo}>✅ Respondidas</Text>
      {porEstado('respondida').map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.pregunta}>❓ {r.pregunta}</Text>
          <Text style={styles.respuesta}>📝 {r.respuesta}</Text>
        </View>
      ))}

      <Text style={styles.subtitulo}>⏳ Pendientes</Text>
      {porEstado('pendiente').map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.pregunta}>❓ {r.pregunta}</Text>
          <Text style={styles.respuesta}>Sin respuesta</Text>
        </View>
      ))}

      <Text style={styles.subtitulo}>❌ Omitidas</Text>
      {porEstado('omitida').map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.pregunta}>❓ {r.pregunta}</Text>
          <Text style={styles.respuesta}>No se respondió</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF7F0',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#A0522D',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  pregunta: {
    fontWeight: 'bold',
  },
  respuesta: {
    marginTop: 4,
  },
});
