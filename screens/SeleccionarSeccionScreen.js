
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const etapas = [
  { nombre: 'Infancia', icono: require('../assets/icons/osito.png') },
  { nombre: 'Adolescencia', icono: require('../assets/icons/adolescencia.png') },
  { nombre: 'Juventud', icono: require('../assets/icons/guitarra.png') },
  { nombre: 'Adulto Joven', icono: require('../assets/icons/trabajo.png') },
  { nombre: 'Adulto Mayor', icono: require('../assets/icons/abuelo.png') },
  { nombre: 'Mensaje final', icono: require('../assets/icons/corazon.png') },
];

export default function SeleccionarSeccionScreen({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [conteos, setConteos] = useState({});

  useEffect(() => {
    const fetchConteos = async () => {
      const nuevosConteos = {};
      for (const etapa of etapas) {
        const docRef = doc(db, 'respuestas', `${user.uid}_${etapa.nombre}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const respuestas = data.respuestas || {};
          const respondidas = Object.values(respuestas).filter((r) => r && r.trim() !== '').length;
          nuevosConteos[etapa.nombre] = respondidas;
        } else {
          nuevosConteos[etapa.nombre] = 0;
        }
      }
      setConteos(nuevosConteos);
    };

    fetchConteos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige una etapa de tu vida</Text>
      {etapas.map((etapa, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate('QuestionsScreen', { etapa: etapa.nombre })}
        >
          <Image source={etapa.icono} style={styles.icono} />
          <View style={styles.info}>
            <Text style={styles.nombre}>{etapa.nombre}</Text>
            <Text style={styles.contador}>{conteos[etapa.nombre] || 0} respondidas</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  icono: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contador: {
    fontSize: 14,
    color: '#555',
  },
});
