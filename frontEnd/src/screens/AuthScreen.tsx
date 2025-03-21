import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';

const AuthScreen: React.FC = () => {
  const handleSignIn = (_email: string, _password: string, _userType: string | null) => {
    Alert.alert(`Invalid Email and Password`);
  };

  return (
    <View style={styles.container}>
      <AuthForm onSubmit={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default AuthScreen;