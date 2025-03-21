import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';

//

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthScreen />
    </SafeAreaView>
  );
  //
  //
  
};

export default App;
