import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const questions = [
  "¿Cuál es tu primer recuerdo feliz?",
  "¿Qué persona te marcó en la infancia?",
  "¿Qué sueño te acompañaba cuando eras niña/o?"
];

export default function QuestionsScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const currentQuestion = questions[currentIndex];
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const speakQuestion = () => {
    Speech.speak(currentQuestion);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    try {
      await addDoc(collection(db, "respuestas"), {
        pregunta: currentQuestion,
        respuesta: answer,
        estado: answer.trim() === "" ? "pendiente" : "respondida",
        uid: user.uid,
        timestamp: serverTimestamp(),
        etapa: "inicial"
      });
    } catch (error) {
      Alert.alert("Error al guardar", error.message);
    }
  };

  const handleNext = async () => {
    await handleSave();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
    } else {
      Alert.alert("¡Gracias!", "Has completado todas las preguntas.");
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion}</Text>
      <Button title="🔊 Escuchar pregunta" onPress={speakQuestion} />
      <TextInput
        style={styles.input}
        placeholder="Escribe tu respuesta aquí..."
        value={answer}
        multiline
        onChangeText={setAnswer}
      />
      <Text style={styles.counter}>Palabras: {wordCount}</Text>
      <Button title="Siguiente" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  question: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 10
  },
  counter: { textAlign: 'right', marginBottom: 10 }
});