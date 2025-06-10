import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function RespuestasScreen() {
  const [respuestas, setRespuestas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');

  useEffect(() => {
    const obtenerRespuestas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'respuestas'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });

      setRespuestas(datos);
    };

    obtenerRespuestas();
  }, []);

  const comenzarEdicion = (item) => {
    setEditandoId(item.id);
    setTextoEditado(item.respuesta);
  };

  const guardarCambios = async (id) => {
    try {
      const ref = doc(db, 'respuestas', id);
      await updateDoc(ref, {
        respuesta: textoEditado,
        estado: textoEditado.trim() === '' ? 'pendiente' : 'respondida',
      });

      setRespuestas((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, respuesta: textoEditado } : item
        )
      );

      setEditandoId(null);
      setTextoEditado('');
    } catch (error) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={respuestas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.pregunta}>{item.pregunta}</Text>
            {editandoId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  multiline
                  value={textoEditado}
                  onChangeText={setTextoEditado}
                />
                <Button title="Guardar" onPress={() => guardarCambios(item.id)} />
              </>
            ) : (
              <>
                <Text style={styles.respuesta}>{item.respuesta || '(Sin respuesta)'}</Text>
                <Text style={styles.estado}>Estado: {item.estado}</Text>
                <Button title="Editar" onPress={() => comenzarEdicion(item)} />
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  pregunta: { fontWeight: 'bold', marginBottom: 5 },
  respuesta: { marginBottom: 5 },
  estado: { fontStyle: 'italic', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});