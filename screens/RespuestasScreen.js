import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { estilosBase, colores } from '../styles/theme';

export default function RespuestasScreen() {
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarRespuestas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(
          collection(db, 'respuestas'),
          where('usuarioID', '==', user.uid),
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
      <View style={estilosBase.contenedor}>
        <ActivityIndicator size="large" color={colores.secundario} />
        <Text style={estilosBase.texto}>Cargando respuestas guardadas...</Text>
      </View>
    );
  }

  if (respuestas.length === 0) {
    return (
      <View style={estilosBase.contenedor}>
        <Text style={estilosBase.titulo}>📭 Aún no hay respuestas guardadas</Text>
        <Text style={estilosBase.subtitulo}>Comienza a escribir tu historia…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📖 Respuestas Guardadas</Text>

      {respuestas.map((resp, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.etapa}>🕰️ Etapa: {resp.etapa}</Text>
          <Text style={styles.pregunta}>📝 {resp.preguntaId}</Text>
          <Text style={styles.respuesta}>{resp.textoRespuesta}</Text>

          <Button
            title="Editar"
            onPress={() =>
              navigation.navigate('EditarPreguntaScreen', {
                pregunta: resp.preguntaId, // Aquí es donde está guardada la pregunta
                idPregunta: resp.id, // usamos el ID del documento
                etapa: resp.etapa,
                uid: auth.currentUser.uid,
                respuestaPrevia: resp.textoRespuesta,
              })
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    elevation: 1,
  },
  etapa: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colores.secundario,
    marginBottom: 4,
  },
  pregunta: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colores.texto,
    marginBottom: 6,
  },
  respuesta: {
    fontSize: 16,
    color: colores.texto,
    lineHeight: 22,
    marginBottom: 8,
  },
});
