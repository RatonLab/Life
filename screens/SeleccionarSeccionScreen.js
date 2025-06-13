import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colores, estilosBase } from '../styles/theme';

const etapas = [
  { nombre: 'Infancia', icono: require('../assets/icons/osito.png') },
  { nombre: 'Adolescencia', icono: require('../assets/icons/adolescencia.png') },
  { nombre: 'Juventud', icono: require('../assets/icons/guitarra.png') },
  { nombre: 'Adulto Joven', icono: require('../assets/icons/trabajo.png') },
  { nombre: 'Adulto Mayor', icono: require('../assets/icons/abuelo.png') },
  { nombre: 'Mensaje Final', icono: require('../assets/icons/corazon.png') },
];

export default function SeleccionarSeccionScreen() {
  const navigation = useNavigation();

  const irAPreguntas = (etapa) => {
    navigation.navigate('QuestionsScreen', { etapa });
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Selecciona una etapa de tu vida</Text>

      <FlatList
        data={etapas}
        keyExtractor={(item) => item.nombre}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => irAPreguntas(item.nombre)}
          >
            <Image source={item.icono} style={styles.icono} />
            <Text style={styles.texto}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    ...estilosBase.contenedor,
    alignItems: 'center',
    paddingTop: 40,
  },
  titulo: {
    ...estilosBase.titulo,
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: 260,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icono: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    color: colores.texto,
    fontWeight: '500',
    textAlign: 'center',
  },
});
