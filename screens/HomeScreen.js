import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { estilosBase } from '../styles/theme';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={estilosBase.contenedor}>
        <Text style={estilosBase.titulo}>Bienvenida a "Mi vida en palabras"</Text>
        <Text style={estilosBase.subtitulo}>
          Una app para escribir tu historia con amor, memoria y emoción. ¿Por dónde quieres empezar?
        </Text>

        <TouchableOpacity
          style={estilosBase.boton}
          onPress={() => navigation.navigate('SeleccionarSeccion')}
        >
          <Text style={estilosBase.botonTexto}>✍️ Comenzar preguntas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosBase.boton}
          onPress={() => navigation.navigate('Respuestas')}
        >
          <Text style={estilosBase.botonTexto}>📖 Ver respuestas guardadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosBase.boton}
          onPress={() => navigation.navigate('FotosPorSeccion')}
        >
          <Text style={estilosBase.botonTexto}>🖼️ Subir fotos por etapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosBase.boton}
          onPress={() => navigation.navigate('ExportarPDF')}
        >
          <Text style={estilosBase.botonTexto}>📄 Exportar libro en PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
