import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebaseConfig';

export default function HistorialLibrosScreen() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const storage = getStorage();
        const usuarioID = auth.currentUser.uid;
        const carpetaRef = ref(storage, `libros/${usuarioID}/`);
        const listado = await listAll(carpetaRef);

        const archivos = await Promise.all(
          listado.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return {
              nombre: item.name,
              url,
              fecha: item.name.split('_')[0], // Si nombraste el archivo con fecha_nombre.pdf
            };
          })
        );

        setLibros(archivos.reverse()); // Más reciente arriba
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarLibros();
  }, []);

  const abrirPDF = async (url) => {
    await Linking.openURL(url);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>📚 Historial de libros generados</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#996633" style={{ marginTop: 30 }} />
      ) : libros.length === 0 ? (
        <Text style={styles.mensaje}>Aún no has generado ningún libro PDF.</Text>
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.nombre}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <TouchableOpacity style={styles.boton} onPress={() => abrirPDF(item.url)}>
                <Text style={styles.botonTexto}>📥 Ver o Compartir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3B2F2F',
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    color: '#555',
    marginTop: 30,
    textAlign: 'center',
  },
  tarjeta: {
    backgroundColor: '#FAF3E0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4B3D33',
  },
  boton: {
    backgroundColor: '#A67B5B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
