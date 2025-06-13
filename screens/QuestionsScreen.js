import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import preguntasPorEtapa from '../utils/preguntasPorEtapa';
import { guardarRespuesta } from '../firebase/respuestas';
import { estilosBase, colores } from '../styles/theme';

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
      <View style={estilosBase.contenedor}>
        <Text style={estilosBase.titulo}>❗ Etapa no recibida</Text>
        <Text style={estilosBase.texto}>
          Por favor, vuelve atrás e intenta de nuevo.
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
        const estado =
          respuestaTexto.trim().length > 0 ? 'respondida' : 'omitida';
        await guardarRespuesta(etapa, pregunta, respuestaTexto, estado);
      }

      Alert.alert(
        '✅ Respuestas guardadas',
        'Tus respuestas fueron registradas correctamente.'
      );
      navigation.navigate('SeleccionarSeccion');
    } catch (error) {
      console.error('Error guardando respuestas:', error);
      Alert.alert(
        'Error',
        'No se pudieron guardar las respuestas. Intenta nuevamente.'
      );
    }
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>Preguntas de la etapa: {etapa}</Text>

      {preguntas.map((pregunta, index) => (
        <View key={index} style={styles.preguntaContainer}>
          <Text style={estilosBase.texto}>{pregunta}</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Escribe tu respuesta..."
            onChangeText={(text) =>
              setRespuestas({ ...respuestas, [pregunta]: text })
            }
            value={respuestas[pregunta] || ''}
          />
        </View>
      ))}

      <TouchableOpacity style={estilosBase.boton} onPress={handleSave}>
        <Text style={estilosBase.botonTexto}>💾 Guardar respuestas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  preguntaContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginTop: 8,
  },
});
