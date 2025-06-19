import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { colores, estilosBase } from '../styles/theme';

export default function RespuestasScreen() {
  const [agrupadas, setAgrupadas] = useState({});

  useEffect(() => {
    const cargarRespuestas = async () => {
      const usuarioID = auth.currentUser.uid;
      const q = query(
        collection(db, 'respuestas'),
        where('usuarioID', '==', usuarioID),
        where('estado', '==', 'respondida')
      );
      const snapshot = await getDocs(q);

      const respuestasPorEtapa = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const etapa = data.etapa || 'Sin etapa';
        if (!respuestasPorEtapa[etapa]) {
          respuestasPorEtapa[etapa] = [];
        }
        respuestasPorEtapa[etapa].push({
          id: doc.id,
          pregunta: data.pregunta || 'Pregunta sin texto',
          respuesta: data.respuesta || 'Sin respuesta',
        });
      });

      setAgrupadas(respuestasPorEtapa);
    };

    cargarRespuestas();
  }, []);

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📄 Respuestas guardadas</Text>

      {Object.keys(agrupadas).length === 0 ? (
        <Text style={styles.texto}>No se encontraron respuestas aún.</Text>
      ) : (
        Object.entries(agrupadas).map(([etapa, respuestas]) => (
          <View key={etapa} style={styles.seccion}>
            <Text style={styles.etapa}>{etapa}</Text>
            {respuestas.map(({ id, pregunta, respuesta }) => (
              <View key={id} style={styles.bloque}>
                <Text style={styles.pregunta}>❓ {pregunta}</Text>
                <Text style={styles.respuesta}>✏️ {respuesta}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  seccion: {
    marginBottom: 24,
  },
  etapa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colores.primario,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
    paddingBottom: 4,
  },
  bloque: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  pregunta: {
    fontWeight: '600',
    color: colores.secundario,
    marginBottom: 6,
  },
  respuesta: {
    color: colores.texto,
  },
  texto: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: colores.texto,
  },
});
