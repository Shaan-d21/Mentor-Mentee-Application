import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import {store} from './src/redux/store';
import 'react-native-gesture-handler';
import { DrawerProvider, useDrawer } from './src/context/drawer_context';
import CustomDrawerContent from './src/components/drawer_component';
import { RootNavigator } from './src/navigation/rootNavigtor';

const AppContent: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();

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