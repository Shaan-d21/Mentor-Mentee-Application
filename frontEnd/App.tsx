

import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from './src/screens/AuthScreens/SignInPage';
import CreateAccountPage from './src/screens/AuthScreens/CreateAccountPage';
import { RootStackParamList } from './src/utils/navigation';
import MenteeDashboard from './src/screens/Dashboards/mentee_dashboard';
import MentorDashboard from './src/screens/Dashboards/mentor_dashboard';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import 'react-native-gesture-handler';
import { DrawerProvider, useDrawer } from './src/context/drawer_context';
import ProfileScreen from './src/screens/profile/profile';
import CustomDrawerContent from './src/components/drawer_component';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="MenteeDashboard"
          screenOptions={() => ({
            headerShown: false,
          })}
        >
          <Stack.Screen name="SignInPage" component={SignInPage} />
          <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} />
          <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
          <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
        {isDrawerOpen && <CustomDrawerContent isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
      </View>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DrawerProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </DrawerProvider>
    </Provider>
  );
  //
  //
  
};

export default App;




// import React from 'react';
// import {SafeAreaView, StatusBar, View} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import SignInPage from './src/screens/AuthScreens/SignInPage';
// import CreateAccountPage from './src/screens/AuthScreens/CreateAccountPage';
// import {RootStackParamList} from './src/utils/navigation';
// import MenteeDashboard from './src/screens/Dashboards/mentee_dashboard';
// import MentorDashboard from './src/screens/Dashboards/mentor_dashboard';
// import {Provider} from 'react-redux';
// import store from './src/redux/store';
// import { DrawerProvider, useDrawer } from './src/context/drawer_context';
// import CustomDrawerContent from './src/components/drawer_component';
// import ProfileScreen from './src/screens/profile/profile';

// const Stack = createNativeStackNavigator<RootStackParamList>();
// // const Drawer = createDrawerNavigator();
// // https://reactnavigation.org/docs/drawer-navigator/ Don't Remove this comment @kavan2003



// const { isDrawerOpen, toggleDrawer } = useDrawer();

// const App: React.FC = () => {
//   return (
//     <Provider store={store}>
//       <DrawerProvider>
//       <NavigationContainer>
//       <SafeAreaView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={{ flex: 1 }}>
//         <Stack.Navigator
//           initialRouteName="MenteeDashboard"
//           screenOptions={() => ({
//             headerShown: false,
//           })}
//         >
//           <Stack.Screen name="SignInPage" component={SignInPage} />
//           <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} />
//           <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
//           <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
//           <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//           <Stack.Screen name="MenteeProgress" component={MenteeDashboard} />
//           <Stack.Screen name="EnrolledCoursesScreen" component={MenteeDashboard} />
//           <Stack.Screen name="FindMentorScreen" component={MenteeDashboard} />
//           <Stack.Screen name="MenteeRequests" component={MenteeDashboard} />
          

//         </Stack.Navigator>
//         {isDrawerOpen && <CustomDrawerContent isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
//       </View>
//     </SafeAreaView>
//       </NavigationContainer>
//       </DrawerProvider>
//     </Provider>
//   );
// };

// export default App;
