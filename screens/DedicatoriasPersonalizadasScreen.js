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
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { estilosBase, colores } from '../styles/theme';

export default function DedicatoriasPersonalizadasScreen() {
  const usuarioId = auth.currentUser.uid;
  const [dedicatorias, setDedicatorias] = useState(
    Array.from({ length: 10 }, () => ({ para: '', texto: '' }))
  );

  useEffect(() => {
    const cargarDedicatorias = async () => {
      try {
        const q = query(collection(db, 'dedicatorias'), where('usuarioId', '==', usuarioId));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const nuevas = Array.from({ length: 10 }, () => ({ para: '', texto: '' }));

        docs.forEach((d) => {
          const idx = typeof d.index === 'number' ? d.index : null;
          if (idx !== null && idx >= 0 && idx < 10) {
            nuevas[idx] = {
              para: d.para || '',
              texto: d.texto || '',
            };
          }
        });

        setDedicatorias(nuevas);
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
    const dedicatoria = dedicatorias[index];
    try {
      const ref = doc(db, 'dedicatorias', `${usuarioId}_dedic${index + 1}`);
      await setDoc(ref, {
        usuarioId,
        para: dedicatoria.para.trim(),
        texto: dedicatoria.texto.trim(),
        index,
      });
      Alert.alert('✅ Guardado', `Dedicatoria ${index + 1} actualizada.`);
    } catch (e) {
      console.error('Error guardando:', e);
      Alert.alert('❌ Error', `No se pudo guardar la dedicatoria ${index + 1}.`);
    }
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>💌 Dedicatorias personalizadas</Text>

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

          <TouchableOpacity style={styles.botonGuardar} onPress={() => guardarUna(i)}>
            <Text style={estilosBase.botonTexto}>Guardar dedicatoria {i + 1}</Text>
          </TouchableOpacity>
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
  botonGuardar: {
    backgroundColor: colores.primario,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
