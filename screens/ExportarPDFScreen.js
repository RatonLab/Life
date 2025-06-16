import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { colores, estilosBase } from '../styles/theme';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function ExportarPDFScreen() {
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('Vintage');
  const [nombreAutor, setNombreAutor] = useState('');

  const estilosDisponibles = ['Vintage', 'Moderno', 'Orgánico'];

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const ref = doc(db, 'usuarios', auth.currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNombreAutor(snap.data().nombre || '');
        }
      } catch (e) {
        console.error('Error al cargar nombre del autor:', e);
      }
    };

    cargarNombre();
  }, []);

  const generarPDF = () => {
    Alert.alert(
      '📘 Generar PDF',
      `Se generará el libro con estilo "${estiloSeleccionado}" y autor "${nombreAutor}".`
    );
    // Aquí se integrará la lógica real de generación del PDF
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📘 Exportar tu libro</Text>

      <Text style={styles.label}>1. Selecciona un estilo visual:</Text>
      <View style={styles.estilos}>
        {estilosDisponibles.map((estilo) => (
          <TouchableOpacity
            key={estilo}
            style={[
              styles.botonEstilo,
              estiloSeleccionado === estilo && styles.estiloSeleccionado,
            ]}
            onPress={() => setEstiloSeleccionado(estilo)}
          >
            <Text
              style={[
                styles.textoEstilo,
                estiloSeleccionado === estilo && styles.textoSeleccionado,
              ]}
            >
              {estilo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={estilosBase.boton} onPress={generarPDF}>
        <Text style={estilosBase.botonTexto}>📄 Generar libro en PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colores.texto,
  },
  estilos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  botonEstilo: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colores.borde,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    minWidth: 100,
    alignItems: 'center',
  },
  estiloSeleccionado: {
    backgroundColor: colores.secundario,
  },
  textoEstilo: {
    fontSize: 14,
    color: '#333',
  },
  textoSeleccionado: {
    color: 'white',
    fontWeight: 'bold',
  },
});
