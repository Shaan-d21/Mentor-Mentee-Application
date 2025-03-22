import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/navigation';


const SignInPage: React.FC = () => {
  
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignInPage'>>();
  const [userType, setUserType] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleFormSubmit = () => {
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid && !isPasswordValid) {
      Alert.alert('Invalid Username and Password');
      return;
    }
    if (!isEmailValid) {
      Alert.alert('Invalid Email');
      return;
    }
    if (!isPasswordValid) {
      Alert.alert('Invalid Password');
      return;
    }
    if (!userType) {
      Alert.alert('Invalid User Type');
      return;
    }
    Alert.alert('Form Submitted Successfully!');
  };

  const userTypes = [
    { label: 'Login as Mentee', value: 'mentee' },
    { label: 'Login as Mentor', value: 'mentor' },
    { label: 'Login as Admin', value: 'admin' }
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Dropdown
          style={styles.dropdown}
          data={userTypes}
          labelField="label"
          valueField="value"
          placeholder="Select Login Role"
          value={userType}
          onChange={(item) => setUserType(item.value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsForgotPassword(!isForgotPassword)}>
          <Text style={styles.toggleText}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
          <Text style={styles.buttonText}>
            {userType === 'mentee'
              ? 'Sign In as Mentee'
              : userType === 'mentor'
              ? 'Sign In as Mentor'
              : userType === 'admin'
              ? 'Sign In as Admin'
              : 'Sign In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccountPage')}>
          <Text style={styles.toggleText}>
            <Text style={{ color: 'gray' }}>Don't have an account? </Text>
            <Text style={styles.toggleText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  dropdown: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#1a73e8',
    textAlign: 'center',
    marginTop: 15,
  }
});
export default SignInPage;
