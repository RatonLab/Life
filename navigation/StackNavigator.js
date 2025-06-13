import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 📱 Pantallas de la app
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SeleccionarSeccionScreen from '../screens/SeleccionarSeccionScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import RespuestasScreen from '../screens/RespuestasScreen';
import ExportarPDFScreen from '../screens/ExportarPDFScreen';
import FotosPorSeccionScreen from '../screens/FotosPorSeccionScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* Pantalla de bienvenida con logo */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      {/* Autenticación */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* Inicio después del login */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />

      {/* Sección de preguntas por etapa */}
      <Stack.Screen
        name="SeleccionarSeccion"
        component={SeleccionarSeccionScreen}
        options={{ title: 'Etapas de tu vida' }}
      />
      <Stack.Screen
        name="QuestionsScreen"
        component={QuestionsScreen}
        options={{ title: 'Tu historia' }}
      />

      {/* Funcionalidades adicionales */}
      <Stack.Screen
        name="Respuestas"
        component={RespuestasScreen}
        options={{ title: 'Respuestas guardadas' }}
      />
      <Stack.Screen
        name="ExportarPDF"
        component={ExportarPDFScreen}
        options={{ title: 'Exportar libro' }}
      />
      <Stack.Screen
        name="FotosPorSeccion"
        component={FotosPorSeccionScreen}
        options={{ title: 'Tus fotos por etapa' }}
      />
    </Stack.Navigator>
  );
}
