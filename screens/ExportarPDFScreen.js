import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ExportarPDFScreen() {
  const [dedicatoria, setDedicatoria] = useState("Para ti, con amor. Esta es mi vida en palabras...");

  const generarPDF = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Usuario no autenticado");

    try {
      const q = query(collection(db, 'respuestas'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      let contenido = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        contenido += `
          <h3>${data.pregunta}</h3>
          <p>${data.respuesta || '(Sin respuesta)'}</p>
          <hr />
        `;
      });

      const html = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="text-align:center;">Mi vida en palabras</h1>
            <blockquote>${dedicatoria}</blockquote>
            ${contenido}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error al generar PDF", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribe una dedicatoria para el PDF..."
        value={dedicatoria}
        onChangeText={setDedicatoria}
      />
      <Button title="Generar PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top'
  }
});