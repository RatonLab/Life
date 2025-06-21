import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { colores, estilosBase } from '../styles/theme';

export default function ResumenRespuestasScreen() {
  const [resumen, setResumen] = useState({});
  const navigation = useNavigation();

  const ordenEtapas = [
    'Infancia',
    'Adolescencia',
    'Juventud',
    'Adulto Joven',
    'Adulto Mayor',
    'Mensaje final',
  ];

  useEffect(() => {
    const cargarResumen = async () => {
      const usuarioID = auth.currentUser.uid;
      const q = query(collection(db, 'respuestas'), where('usuarioID', '==', usuarioID));
      const snapshot = await getDocs(q);

      const resumenPorEtapa = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const etapa = data.etapa || 'Sin etapa';
        const estado = data.estado || 'desconocido';

        if (!resumenPorEtapa[etapa]) {
          resumenPorEtapa[etapa] = { respondida: 0, omitida: 0 };
        }

        if (estado === 'respondida') resumenPorEtapa[etapa].respondida += 1;
        else if (estado === 'omitida') resumenPorEtapa[etapa].omitida += 1;
        // No almacenamos pendientes porque se calculan restando sobre 15
      });

      setResumen(resumenPorEtapa);
    };

    cargarResumen();
  }, []);

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📊 Resumen por etapa</Text>

      {ordenEtapas.map((etapa) => {
        const conteos = resumen[etapa];
        if (!conteos) return null;

        const total = conteos.respondida + conteos.omitida;
        const pendientes = 15 - total;

        return (
          <TouchableOpacity
            key={etapa}
            style={styles.bloque}
            onPress={() => navigation.navigate('ResumenDetalleEtapa', { etapa })}
          >
            <Text style={styles.etapa}>{etapa}</Text>
            <Text style={styles.linea}>✅ Respondidas: {conteos.respondida}</Text>
            <Text style={styles.linea}>❌ Omitidas: {conteos.omitida}</Text>
            <Text style={styles.linea}>⏳ Pendientes: {pendientes >= 0 ? pendientes : 0}</Text>
            <Text style={styles.total}>📌 Total: 15</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bloque: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  etapa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.primario,
    marginBottom: 8,
  },
  linea: {
    fontSize: 16,
    marginBottom: 4,
    color: colores.texto,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: colores.secundario,
  },
});
