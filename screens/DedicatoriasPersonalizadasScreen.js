import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { estilosBase, colores } from '../styles/theme';

export default function DedicatoriasPersonalizadasScreen() {
  const usuarioId = auth.currentUser.uid;
  const [dedicatorias, setDedicatorias] = useState([]);

  useEffect(() => {
    const cargarDedicatorias = async () => {
      try {
        const ref = doc(db, 'dedicatorias', usuarioId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const mensajes = data.mensajes || [];
          const nuevas = mensajes.slice(0, 10).map((item) => ({
            para: item.titulo || '',
            texto: item.texto || '',
          }));
          setDedicatorias(nuevas);
        }
      } catch (e) {
        console.error('Error cargando dedicatorias:', e);
        Alert.alert('❌ Error', 'No se pudieron cargar las dedicatorias.');
      }
    };

    cargarDedicatorias();
  }, []);

  const actualizarCampo = (index, campo, valor) => {
    setDedicatorias((prev) => {
      const nuevas = [...prev];
      nuevas[index] = { ...nuevas[index], [campo]: valor };
      return nuevas;
    });
  };

  const guardarUna = async (index) => {
    const dedicatoriasValidas = dedicatorias
      .filter((d) => d.para.trim() && d.texto.trim())
      .map((d) => ({
        titulo: d.para.trim(),
        texto: d.texto.trim(),
      }));

    try {
      const ref = doc(db, 'dedicatorias', usuarioId);
      await setDoc(ref, {
        mensajes: dedicatoriasValidas,
      });
      Alert.alert('✅ Guardado', `Dedicatoria ${index + 1} actualizada.`);
    } catch (e) {
      console.error('Error guardando:', e);
      Alert.alert('❌ Error', `No se pudo guardar la dedicatoria ${index + 1}.`);
    }
  };

  const eliminarUna = async (index) => {
    const nuevas = [...dedicatorias];
    nuevas.splice(index, 1);
    setDedicatorias(nuevas);

    const dedicatoriasValidas = nuevas
      .filter((d) => d.para.trim() && d.texto.trim())
      .map((d) => ({
        titulo: d.para.trim(),
        texto: d.texto.trim(),
      }));

    try {
      const ref = doc(db, 'dedicatorias', usuarioId);
      await setDoc(ref, {
        mensajes: dedicatoriasValidas,
      });
      Alert.alert('🗑️ Eliminada', `Dedicatoria ${index + 1} fue eliminada.`);
    } catch (e) {
      console.error('Error eliminando:', e);
      Alert.alert('❌ Error', 'No se pudo eliminar la dedicatoria.');
    }
  };

  const agregarDedicatoria = () => {
    if (dedicatorias.length >= 10) {
      Alert.alert('⚠️ Límite alcanzado', 'Solo puedes agregar hasta 10 dedicatorias.');
      return;
    }
    setDedicatorias([...dedicatorias, { para: '', texto: '' }]);
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>💌 Dedicatorias personalizadas</Text>

      <TouchableOpacity style={styles.botonAgregar} onPress={agregarDedicatoria}>
        <Text style={styles.botonAgregarTexto}>➕ Agregar dedicatoria</Text>
      </TouchableOpacity>

      {dedicatorias.map((d, i) => (
        <View key={i} style={styles.bloque}>
          <Text style={styles.tituloBloque}>Dedicatoria {i + 1}</Text>

          <TextInput
            placeholder="Para... (ej. Josefina)"
            style={styles.input}
            value={d.para}
            onChangeText={(text) => actualizarCampo(i, 'para', text)}
            maxLength={100}
          />

          <TextInput
            placeholder="Mensaje personalizado..."
            style={[styles.input, { height: 120 }]}
            value={d.texto}
            multiline
            maxLength={8000}
            onChangeText={(text) => actualizarCampo(i, 'texto', text)}
          />

          <Text style={styles.contador}>{d.texto.length} / 8000 caracteres</Text>

          <View style={styles.botonesFila}>
            <TouchableOpacity style={styles.botonGuardar} onPress={() => guardarUna(i)}>
              <Text style={estilosBase.botonTexto}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarUna(i)}>
              <Text style={estilosBase.botonTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bloque: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  tituloBloque: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
    color: colores.secundario,
  },
  input: {
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  contador: {
    textAlign: 'right',
    color: '#777',
    fontSize: 12,
    marginBottom: 10,
  },
  botonAgregar: {
    backgroundColor: colores.terciario,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  botonAgregarTexto: {
    color: '#333', // Texto oscuro para mejor visibilidad
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonesFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botonGuardar: {
    backgroundColor: colores.primario,
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#cc4444',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
