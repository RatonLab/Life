import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import RespuestasScreen from './screens/RespuestasScreen';
import ExportarPDFScreen from './screens/ExportarPDFScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
        <Stack.Screen name="Respuestas" component={RespuestasScreen} />
        <Stack.Screen name="ExportarPDF" component={ExportarPDFScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}