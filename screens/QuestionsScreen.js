import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import preguntasPorEtapa from '../utils/preguntasPorEtapa';
import { guardarRespuesta } from '../firebase/respuestas'; // IMPORTANTE

export default function QuestionsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { etapa } = route.params || {};
  const auth = getAuth();
  const user = auth.currentUser;
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  if (!etapa) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          ❗ Error: No se recibió la etapa correctamente. Por favor, vuelve atrás e intenta de nuevo.
        </Text>
      </View>
    );
  }

  useEffect(() => {
    if (preguntasPorEtapa[etapa]) {
      setPreguntas(preguntasPorEtapa[etapa]);
    }
  }, [etapa]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      for (const [pregunta, respuestaTexto] of Object.entries(respuestas)) {
        const estado = respuestaTexto.trim().length > 0 ? "respondida" : "omitida";
        await guardarRespuesta(etapa, pregunta, respuestaTexto, estado);
      }

      Alert.alert("✅ Respuestas guardadas", "Tus respuestas fueron registradas correctamente.");
      navigation.navigate('SeleccionarSeccion');
    } catch (error) {
      console.error("Error guardando respuestas:", error);
      Alert.alert("Error", "No se pudieron guardar las respuestas.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preguntas: {etapa}</Text>
      {preguntas.map((pregunta, index) => (
        <View key={index} style={styles.preguntaContainer}>
          <Text style={styles.pregunta}>{pregunta}</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            onChangeText={(text) =>
              setRespuestas({ ...respuestas, [pregunta]: text })
            }
            value={respuestas[pregunta] || ''}
            placeholder="Escribe tu respuesta..."
          />
        </View>
      ))}
      <Button title="Guardar respuestas" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  preguntaContainer: {
    marginBottom: 20,
  },
  pregunta: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center'
  }
});
