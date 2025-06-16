import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { colores, estilosBase } from '../styles/theme';

export default function DedicatoriasScreen() {
  const [dedicatorias, setDedicatorias] = useState([]);
  const [nuevaDedicatoria, setNuevaDedicatoria] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarDedicatorias = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const q = query(collection(db, 'dedicatorias'), where('usuarioId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDedicatorias(datos);
    } catch (error) {
      console.error('Error al cargar dedicatorias:', error);
    } finally {
      setCargando(false);
    }
  };

  const guardarDedicatoria = async () => {
    if (nuevaDedicatoria.trim().length === 0) return;

    if (dedicatorias.length >= 10) {
      Alert.alert('Límite alcanzado', 'Solo puedes guardar hasta 10 dedicatorias.');
      return;
    }

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'dedicatorias'), {
        usuarioId: user.uid,
        mensaje: nuevaDedicatoria.trim(),
        timestamp: Date.now(),
      });
      setNuevaDedicatoria('');
      cargarDedicatorias();
    } catch (error) {
      console.error('Error al guardar dedicatoria:', error);
    }
  };

  const eliminarDedicatoria = async (id) => {
    try {
      await deleteDoc(doc(db, 'dedicatorias', id));
      cargarDedicatorias();
    } catch (error) {
      console.error('Error al eliminar dedicatoria:', error);
    }
  };

  useEffect(() => {
    cargarDedicatorias();
  }, []);

  return (
    <View style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>💌 Dedicatorias personalizadas</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe tu dedicatoria..."
        value={nuevaDedicatoria}
        onChangeText={setNuevaDedicatoria}
        multiline
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardarDedicatoria}>
        <Text style={styles.textoBoton}>Guardar dedicatoria</Text>
      </TouchableOpacity>

      <FlatList
        data={dedicatorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.mensaje}>{item.mensaje}</Text>
            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() =>
                Alert.alert('¿Eliminar?', '¿Deseas eliminar esta dedicatoria?', [
                  { text: 'Cancelar' },
                  { text: 'Eliminar', onPress: () => eliminarDedicatoria(item.id) },
                ])
              }
            >
              <Text style={styles.textoEliminar}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    minHeight: 60,
  },
  botonGuardar: {
    backgroundColor: colores.primario,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  mensaje: {
    fontSize: 16,
    marginBottom: 8,
  },
  botonEliminar: {
    alignItems: 'flex-end',
  },
  textoEliminar: {
    color: 'red',
    fontWeight: 'bold',
  },
});
