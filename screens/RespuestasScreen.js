import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function RespuestasScreen() {
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarRespuestas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(
          collection(db, 'respuestas'),
          where('usuarioId', '==', user.uid),
          where('estado', '==', 'respondida')
        );

        const querySnapshot = await getDocs(q);
        const respuestasObtenidas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRespuestas(respuestasObtenidas);
      } catch (error) {
        console.error('Error al cargar respuestas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarRespuestas();
  }, []);

  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando respuestas guardadas...</Text>
      </View>
    );
  }

  if (respuestas.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No hay respuestas guardadas aún.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📖 Respuestas Guardadas</Text>
      {respuestas.map((resp, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.etapa}>Etapa: {resp.etapa}</Text>
          <Text style={styles.pregunta}>📝 {resp.preguntaId}</Text>
          <Text style={styles.respuesta}>{resp.textoRespuesta}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  etapa: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pregunta: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  respuesta: {
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
