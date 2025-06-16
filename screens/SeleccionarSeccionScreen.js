import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import preguntasPorEtapa from '../utils/preguntasPorEtapa';

const imagenesEtapa = {
  Infancia: require('../assets/icons/osito.png'),
  Adolescencia: require('../assets/icons/mochila.png'),
  Juventud: require('../assets/icons/guitarra.png'),
  AdultoJoven: require('../assets/icons/taza.png'),
  AdultoMayor: require('../assets/icons/abuelo.png'), // Puedes usar 'trabajo.png' si prefieres
  MensajeFinal: require('../assets/icons/corazon.png'),
};

export default function SeleccionarSeccionScreen({ navigation }) {
  const [progreso, setProgreso] = useState({});
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const cargarProgreso = async () => {
      const etapas = Object.keys(preguntasPorEtapa);
      let nuevoProgreso = {};

      for (const etapa of etapas) {
        const total = preguntasPorEtapa[etapa].length;

        const q = query(
          collection(db, 'respuestas'),
          where('usuarioID', '==', uid),
          where('etapa', '==', etapa),
          where('estado', '==', 'respondida')
        );

        const snap = await getDocs(q);
        const respondidas = snap.size;

        nuevoProgreso[etapa] = {
          total,
          respondidas,
        };
      }

      setProgreso(nuevoProgreso);
    };

    if (uid) cargarProgreso();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Selecciona una etapa de tu vida</Text>

      {Object.keys(preguntasPorEtapa).map((etapa) => {
        const img = imagenesEtapa[etapa];
        const datos = progreso[etapa] || { total: 0, respondidas: 0 };

        return (
          <TouchableOpacity
            key={etapa}
            style={styles.card}
            onPress={() => navigation.navigate('QuestionsScreen', { etapa })}
          >
            <Image source={img} style={styles.imagen} resizeMode="cover" />
            <Text style={styles.nombreEtapa}>{etapa}</Text>
            <Text style={styles.progreso}>
              {datos.respondidas} / {datos.total} respondidas
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5EB',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  imagen: {
    width: 90,
    height: 90,
    marginBottom: 12,
    borderRadius: 12,
  },
  nombreEtapa: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progreso: {
    fontSize: 14,
    color: '#666',
  },
});
