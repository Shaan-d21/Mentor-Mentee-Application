import React, { useEffect } from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInPage from './src/screens/AuthScreens/SignInPage';
import CreateAccountPage from './src/screens/AuthScreens/CreateAccountPage';
import {RootStackParamList} from './src/utils/navigation';
import MenteeDashboard from './src/screens/Dashboards/mentee_dashboard';
import MentorDashboard from './src/screens/Dashboards/mentor_dashboard';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import { signUpUser } from './src/services/api';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const Drawer = createDrawerNavigator();
// https://reactnavigation.org/docs/drawer-navigator/ Don't Remove this comment @kavan2003

const App: React.FC = () => {


  

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <Stack.Navigator
            initialRouteName="SignInPage"
            screenOptions={() => ({
              headerShown: false,
            })}>
            <Stack.Screen name="SignInPage" component={SignInPage} />
            <Stack.Screen
              name="CreateAccountPage"
              component={CreateAccountPage}
            />
            <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
            <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
