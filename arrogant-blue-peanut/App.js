import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// EKRANLAR
import StatisticScreen from './screens/StatisticScreen';
import SettingScreen from './screens/SettingScreen';

// MODALLAR
import MyTasksModal from './screens/MyTasksModal';
import CycleSettingsModal from './screens/CycleSettingsModal';
import ShareStatsModal from './screens/ShareStatsModal';

// TIMER 
import TimerScreen from './screens/TimerScreen.js'; 


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
