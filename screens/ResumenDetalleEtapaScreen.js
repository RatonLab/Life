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

  const mostrarPregunta = (texto) => {
    if (!texto || texto.trim() === '') return 'Pregunta no disponible';
    return texto;
  };

  // Cálculo directo
  const respondidas = porEstado('respondida');
  const omitidas = porEstado('omitida');
  const totalPreguntas = 15;
  const pendientes = totalPreguntas - (respondidas.length + omitidas.length);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{etapa}</Text>

      {/* Resumen de estados */}
      <View style={styles.resumen}>
        <Text style={styles.resumenTexto}>✅ Respondidas: {respondidas.length}</Text>
        <Text style={styles.resumenTexto}>❌ Omitidas: {omitidas.length}</Text>
        <Text style={styles.resumenTexto}>⏳ Pendientes: {pendientes >= 0 ? pendientes : 0}</Text>
      </View>

      {/* Sección Respondidas */}
      {respondidas.length > 0 && (
        <>
          <Text style={styles.subtitulo}>✅ Respondidas</Text>
          {respondidas.map((r, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.pregunta}>❓ {mostrarPregunta(r.preguntaId)}</Text>
            </View>
          ))}
        </>
      )}

      {/* Sección Omitidas */}
      {omitidas.length > 0 && (
        <>
          <Text style={styles.subtitulo}>❌ Omitidas</Text>
          {omitidas.map((r, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.pregunta}>❓ {mostrarPregunta(r.preguntaId)}</Text>
            </View>
          ))}
        </>
      )}
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
  resumen: {
    backgroundColor: '#FFEBD8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  resumenTexto: {
    fontSize: 16,
    marginBottom: 4,
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
    color: '#444',
  },
});
