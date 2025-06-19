import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colores, estilosBase } from '../styles/theme';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { generarLibroPDF } from '../utils/generarLibroPDF';
import { useNavigation } from '@react-navigation/native';
import portadaUnica from '../assets/portadas/portada_unica.png';

export default function ExportarPDFScreen() {
  const [nombreAutor, setNombreAutor] = useState('');
  const [dedicatorias, setDedicatorias] = useState([]);
  const [dedicatoriaSeleccionada, setDedicatoriaSeleccionada] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('mi_vida_en_palabras');
  const navigation = useNavigation();

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

  const generarPDF = async () => {
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

    try {
      await generarLibroPDF(nombreAutor, dedicatoriaSeleccionada, nombreArchivo);
      Alert.alert('✅ ¡Libro generado!', 'Tu libro fue creado correctamente y está listo para compartir.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('❌ Error', 'Ocurrió un problema al generar el libro. Intenta nuevamente.');
    }
  };

  return (
    <ScrollView style={estilosBase.contenedor}>
      <Text style={estilosBase.titulo}>📘 Exportar tu libro</Text>

      {/* Vista previa fija de la portada */}
      <Text style={{ fontSize: 14, marginBottom: 8, color: colores.texto }}>
        Vista previa de la portada:
      </Text>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={portadaUnica}
          style={{ width: 200, height: 280, resizeMode: 'contain', borderRadius: 10 }}
        />
      </View>

      {/* Campo para ingresar nombre de archivo */}
      <Text style={styles.label}>Nombre del archivo PDF:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: libro_para_mamá"
        value={nombreArchivo}
        onChangeText={setNombreArchivo}
      />
      <Text style={styles.preview}>📁 Se guardará como: <Text style={{ fontWeight: 'bold' }}>{nombreArchivo || 'mi_vida_en_palabras'}.pdf</Text></Text>

      {/* Dedicatoria */}
      <Text style={styles.label}>Selecciona una dedicatoria:</Text>
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    color: colores.texto,
  },
  preview: {
    fontSize: 14,
    marginBottom: 20,
    color: '#555',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
