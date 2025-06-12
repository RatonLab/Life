import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenida a 'Mi vida en palabras'</Text>

      <Button
        title="Comenzar preguntas"
        onPress={() => navigation.navigate('SeleccionarSeccion')}
      />
      <Button
        title="Ver respuestas guardadas"
        onPress={() => navigation.navigate('Respuestas')}
      />
      <Button
        title="Generar PDF"
        onPress={() => navigation.navigate('ExportarPDF')}
      />
      <Button
        title="Agregar fotos por sección"
        onPress={() => navigation.navigate('FotosPorSeccion')}
      />
    </View>
  );
}
