import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colores, estilosBase } from '../styles/theme';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { generarLibroPDF } from '../utils/generarLibroPDF';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export default function ExportarPDFScreen() {
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('Vintage');
  const [nombreAutor, setNombreAutor] = useState('');
  const [dedicatorias, setDedicatorias] = useState([]);
  const [dedicatoriaSeleccionada, setDedicatoriaSeleccionada] = useState('');
  const navigation = useNavigation();

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

    const cargarDedicatorias = async () => {
      try {
        const ref = doc(db, 'dedicatorias', auth.currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const lista = data.mensajes || [];
          setDedicatorias(lista);
          if (lista.length > 0) {
            setDedicatoriaSeleccionada(lista[0].texto);
          }
        }
      } catch (e) {
        console.error('Error al cargar dedicatorias:', e);
      }
    };

    cargarNombre();
    cargarDedicatorias();
  }, []);

  const generarPDF = () => {
    if (!nombreAutor.trim()) {
      Alert.alert(
        '❗ Nombre requerido',
        'Por favor, completa tu nombre en la sección "Editar perfil" antes de generar el libro.',
        [
          {
            text: 'Ir a Editar Perfil',
            onPress: () => navigation.navigate('EditarPerfil'),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    if (!dedicatoriaSeleccionada) {
      Alert.alert('❗ Dedicatoria requerida', 'Selecciona una dedicatoria antes de exportar.');
      return;
    }

    generarLibroPDF(nombreAutor, estiloSeleccionado, dedicatoriaSeleccionada, null);
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📘 Exportar tu libro</Text>

      {/* Estilo visual */}
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

      {/* Dedicatoria */}
      <Text style={styles.label}>2. Selecciona una dedicatoria:</Text>
      {dedicatorias.length > 0 ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dedicatoriaSeleccionada}
            onValueChange={(itemValue) => setDedicatoriaSeleccionada(itemValue)}
          >
            {dedicatorias.map((dedi, idx) => (
              <Picker.Item
                key={idx}
                label={dedi.titulo || `Dedicatoria ${idx + 1}`}
                value={dedi.texto}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={{ marginBottom: 20 }}>No has agregado dedicatorias aún.</Text>
      )}

      {/* Botón exportar */}
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
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
