import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import {store} from './src/redux/store';
import 'react-native-gesture-handler';
import { DrawerProvider, useDrawer } from './src/context/drawer_context';
import CustomDrawerContent from './src/components/drawer_component';
import { RootNavigator } from './src/navigation/rootNavigtor';

import { LogBox } from "react-native";

LogBox.ignoreAllLogs(); // Disable all warnings and errors


const AppContent: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const Menteeprofile_status = useSelector((state: any) => state.menteeProfile.Menteeprofile_status);
useEffect(() => {
  console.log(`APP from Mentee Profile Status: ${Menteeprofile_status}`);
}
, [Menteeprofile_status]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <RootNavigator />
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