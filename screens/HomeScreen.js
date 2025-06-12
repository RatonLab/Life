import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenida a "Mi vida en palabras"</Text>

      <Button
        title="Comenzar preguntas"
        onPress={() => navigation.navigate('SeleccionarSeccion')}
      />
      <View style={styles.spacer} />

      <Button
        title="Ver respuestas guardadas"
        onPress={() => navigation.navigate('Respuestas')}
      />
      <View style={styles.spacer} />

      <Button
        title="Subir fotos por etapa"
        onPress={() => navigation.navigate('FotosPorSeccion')}
      />
      <View style={styles.spacer} />

      <Button
        title="Exportar libro en PDF"
        onPress={() => navigation.navigate('ExportarPDF')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 16,
  },
});
