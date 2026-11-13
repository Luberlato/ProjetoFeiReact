import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PlayerListScreen from './src/screens/PlayerListScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import PlayerFormScreen from './src/screens/PlayerFormScreen';
import TalentScanScreen from './src/screens/TalentScanScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="PlayerList" component={PlayerListScreen} />
          <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
          <Stack.Screen name="PlayerForm" component={PlayerFormScreen} />
          <Stack.Screen name="TalentScan" component={TalentScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
