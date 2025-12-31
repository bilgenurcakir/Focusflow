import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// EKRANLAR
import StatisticScreen from './Screens/StatisticScreen';
import SettingScreen from './Screens/SettingScreen';

// MODALLAR
import MyTasksModal from './Screens/MyTasksModal';
import CycleSettingsModal from './Screens/CycleSettingsModal';
import ShareStatsModal from './Screens/ShareStatsModal';

// TIMER 
import TimerScreen from './Screens/TimerScreen.js'; 


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* headerShown: false -> üst başlık çubuğunu gizle */}

        {/* ANA EKRAN */}
        <Stack.Screen name="Timer" component={TimerScreen} />

        {/* NORMAL EKRANLAR */}
        <Stack.Screen name="Statistic" component={StatisticScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />

        {/* MODALLAR */}
         {/* presentation: 'modal' -> bu ekranı modal olarak aç */}
        <Stack.Screen
          name="TasksModal"
          component={MyTasksModal}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="CycleModal"
          component={CycleSettingsModal}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="ShareModal"
          component={ShareStatsModal}
          options={{ presentation: 'modal' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
