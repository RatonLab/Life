import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { estilosBase, colores } from '../styles/theme';

export default function MenuRespuestasScreen({ navigation }) {
  return (
    <View style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📚 Opciones de Respuestas</Text>

      <View style={styles.boton}>
        <Button
          title="Ver respuestas guardadas"
          onPress={() => navigation.navigate('Respuestas')}
          color={colores.primario}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="Ver resumen por etapa"
          onPress={() => navigation.navigate('ResumenRespuestas')}
          color={colores.secundario}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="Volver al inicio"
          onPress={() => navigation.navigate('Home')}
          color={colores.texto}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boton: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
