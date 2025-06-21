import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 📱 Pantallas de la app
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SeleccionarSeccionScreen from '../screens/SeleccionarSeccionScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import EditarPreguntaScreen from '../screens/EditarPreguntaScreen';
import RespuestasScreen from '../screens/RespuestasScreen';
import ExportarPDFScreen from '../screens/ExportarPDFScreen';
import FotosPorSeccionScreen from '../screens/FotosPorSeccionScreen';
import DedicatoriasPersonalizadasScreen from '../screens/DedicatoriasPersonalizadasScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import ResumenRespuestasScreen from '../screens/ResumenRespuestasScreen';
import MenuRespuestasScreen from '../screens/MenuRespuestasScreen';
import PensamientoFinalScreen from '../screens/PensamientoFinalScreen';
import HistorialLibrosScreen from '../screens/HistorialLibrosScreen';
import ResumenDetalleEtapaScreen from '../screens/ResumenDetalleEtapaScreen'; // ✅ Verifica que exista y esté exportado

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* Bienvenida */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

      {/* Autenticación */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

      {/* Inicio */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />

      {/* Preguntas por etapa */}
      <Stack.Screen name="SeleccionarSeccion" component={SeleccionarSeccionScreen} options={{ title: 'Etapas de tu vida' }} />
      <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} options={{ title: 'Tu historia' }} />
      <Stack.Screen name="EditarPreguntaScreen" component={EditarPreguntaScreen} options={{ title: 'Editar respuesta' }} />

      {/* Menú de respuestas */}
      <Stack.Screen name="MenuRespuestas" component={MenuRespuestasScreen} options={{ title: 'Respuestas guardadas' }} />
      <Stack.Screen name="Respuestas" component={RespuestasScreen} options={{ title: 'Listado de respuestas' }} />
      <Stack.Screen name="ResumenRespuestas" component={ResumenRespuestasScreen} options={{ title: 'Resumen por etapa' }} />
      <Stack.Screen name="ResumenDetalleEtapa" component={ResumenDetalleEtapaScreen} options={{ title: 'Detalle por etapa' }} />

      {/* Exportación y elementos adicionales */}
      <Stack.Screen name="ExportarPDF" component={ExportarPDFScreen} options={{ title: 'Exportar libro' }} />
      <Stack.Screen name="FotosPorSeccion" component={FotosPorSeccionScreen} options={{ title: 'Tus fotos por etapa' }} />
      <Stack.Screen name="Dedicatorias" component={DedicatoriasPersonalizadasScreen} options={{ title: 'Dedicatorias personalizadas' }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ title: 'Editar perfil' }} />
      <Stack.Screen name="PensamientoFinal" component={PensamientoFinalScreen} options={{ title: 'Pensamiento final' }} />

      {/* Historial */}
      <Stack.Screen name="HistorialLibros" component={HistorialLibrosScreen} options={{ title: 'Historial de libros' }} />
    </Stack.Navigator>
  );
}
