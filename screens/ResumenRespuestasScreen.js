import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { estilosBase, colores } from '../styles/theme';

export default function ResumenRespuestasScreen({ navigation }) {
  const [resumen, setResumen] = useState({});

  useEffect(() => {
    const cargarResumen = async () => {
      const usuarioID = auth.currentUser.uid;
      const q = query(
        collection(db, 'respuestas'),
        where('usuarioID', '==', usuarioID),
        where('estado', '==', 'respondida')
      );
      const snapshot = await getDocs(q);

      const conteo = {};
      snapshot.forEach(doc => {
        const etapa = doc.data().etapa || 'Sin etapa';
        conteo[etapa] = (conteo[etapa] || 0) + 1;
      });

      setResumen(conteo);
    };

    cargarResumen();
  }, []);

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📊 Resumen de respuestas</Text>

      {Object.keys(resumen).length === 0 ? (
        <Text style={styles.texto}>No se encontraron respuestas aún.</Text>
      ) : (
        Object.entries(resumen).map(([etapa, cantidad]) => (
          <View key={etapa} style={styles.bloque}>
            <Text style={styles.etapa}>{etapa}</Text>
            <Text style={styles.cantidad}>{cantidad} respondidas</Text>
          </View>
        ))
      )}

      <View style={styles.botonContenedor}>
        <Button
          title="Volver al inicio"
          onPress={() => navigation.navigate('Home')}
          color={colores.primario}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bloque: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  etapa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.secundario,
  },
  cantidad: {
    fontSize: 16,
    color: colores.texto,
    marginTop: 4,
  },
  texto: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: colores.texto,
  },
  botonContenedor: {
    marginTop: 30,
    marginBottom: 50,
    paddingHorizontal: 20,
  },
});
