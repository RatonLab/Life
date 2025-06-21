import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colores } from '../styles/theme';

export default function MenuRespuestasScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.icono}>📚</Text>
      <Text style={styles.titulo}>Opciones de Respuestas</Text>

      <TouchableOpacity
        style={[styles.boton, styles.botonRosa]}
        onPress={() => navigation.navigate('Respuestas')}
      >
        <Text style={styles.textoBoton}>📖 Ver respuestas guardadas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('ResumenRespuestas')}
      >
        <Text style={styles.textoBoton}>📊 Ver resumen por etapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonNegro}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.textoBoton}>🏠 Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EB',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: {
    fontSize: 48,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3E3E3E',
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  botonRosa: {
    backgroundColor: '#EBA9A9',
  },
  botonNegro: {
    backgroundColor: '#222',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
