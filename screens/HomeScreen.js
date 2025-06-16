import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const cerrarSesion = async () => {
    await auth.signOut();
    navigation.replace('Login');
  };

  const Boton = ({ title, icon, onPress, color = '#1E90FF' }) => (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.botonTexto}>{icon} {title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>👋 Bienvenido a “Mi vida en palabras”</Text>

      <View style={styles.botones}>
        <Boton
          title="Comenzar tu historia"
          icon="📖"
          onPress={() => navigation.navigate('SeleccionarSeccion')}
        />
        <Boton
          title="Ver respuestas guardadas"
          icon="💾"
          onPress={() => navigation.navigate('Respuestas')}
        />
        <Boton
          title="Subir fotos por etapa"
          icon="🖼️"
          onPress={() => navigation.navigate('FotosPorSeccion')}
        />
        <Boton
          title="Exportar libro PDF"
          icon="📤"
          onPress={() => navigation.navigate('ExportarPDF')}
        />
        <Boton
          title="Dedicatorias personalizadas"
          icon="💌"
          onPress={() => navigation.navigate('Dedicatorias')}
        />
        <Boton
          title="Cerrar sesión"
          icon="🚪"
          color="crimson"
          onPress={cerrarSesion}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFF5EB',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  botones: {
    width: '100%',
    gap: 14,
  },
  boton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
