import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const secciones = ['Infancia', 'Adolescencia', 'Juventud', 'Adultez', 'Vejez', 'Mensaje final'];

export default function FotosPorSeccionScreen() {
  const [fotos, setFotos] = useState({});
  const [descripcion, setDescripcion] = useState('');
  const [loadingSeccion, setLoadingSeccion] = useState('');

  const storage = getStorage();

  const pickImage = async (seccion) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const nombreArchivo = `imagen_${Date.now()}.jpg`;
      const path = `fotos/${user.uid}/${seccion}/${nombreArchivo}`;
      const storageRef = ref(storage, path);

      try {
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'fotos_usuario'), {
          uid: user.uid,
          seccion,
          url,
          descripcion,
          timestamp: Date.now()
        });

        setFotos((prev) => ({
          ...prev,
          [seccion]: [...(prev[seccion] || []), { url, descripcion }]
        }));

        setDescripcion('');
      } catch (error) {
        Alert.alert("Error al subir imagen", error.message);
      }
    }
  };

  const cargarFotosIniciales = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'fotos_usuario'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const agrupadas = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!agrupadas[data.seccion]) agrupadas[data.seccion] = [];
      agrupadas[data.seccion].push({ url: data.url, descripcion: data.descripcion });
    });

    setFotos(agrupadas);
  };

  useEffect(() => {
    cargarFotosIniciales();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {secciones.map((seccion) => (
        <View key={seccion} style={styles.bloque}>
          <Text style={styles.titulo}>{seccion}</Text>

          {(fotos[seccion] || []).map((foto, index) => (
            <View key={index} style={styles.fotoContainer}>
              <Image source={{ uri: foto.url }} style={styles.imagen} />
              <Text style={styles.descripcion}>{foto.descripcion}</Text>
            </View>
          ))}

          {(fotos[seccion] || []).length < 6 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Descripción de la foto"
                value={descripcion}
                onChangeText={setDescripcion}
              />
              <Button title="Agregar foto" onPress={() => pickImage(seccion)} />
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  bloque: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8
  },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  fotoContainer: {
    marginBottom: 10
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 8
  },
  descripcion: {
    marginTop: 4,
    fontStyle: 'italic'
  }
});