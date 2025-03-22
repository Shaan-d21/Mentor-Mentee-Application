import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from './src/screens/AuthScreens/SignInPage';
import CreateAccountPage from './src/screens/AuthScreens/CreateAccountPage';
import { RootStackParamList } from './src/utils/navigation';
import MenteeDashboard from './src/screens/Dashboards/mentee_dashboard';
import MentorDashboard from './src/screens/Dashboards/mentor_dashboard';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="SignInPage">
            <Stack.Screen name="SignInPage" component={SignInPage} options={{ headerShown: false }} />
            <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} options={{ headerShown: false }} />
            <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="MentorDashboard" component={MentorDashboard} options={{ headerShown: false }} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
