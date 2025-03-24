import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/navigation';
import { useDispatch } from 'react-redux';
import { setUserType, setEmail, setPassword } from '../../redux/slices/authSlices';

const SignInPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignInPage'>>();
  const dispatch = useDispatch();
  const [userTypeLocal, setUserTypeLocal] = React.useState<string | null>(null);
  const [emailLocal, setEmailLocal] = React.useState('');
  const [passwordLocal, setPasswordLocal] = React.useState('');
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleFormSubmit = () => {
    const isEmailValid = emailRegex.test(emailLocal);
    const isPasswordValid = passwordLocal.length >= 6;

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
    if (!userTypeLocal) {
      Alert.alert('Invalid User Type');
      return;
    }
    dispatch(setUserType(userTypeLocal));
    dispatch(setEmail(emailLocal));
    dispatch(setPassword(passwordLocal));
    Alert.alert('Form Submitted Successfully!');
  };

  const userTypes = [
    { label: 'Login as Mentee', value: 'mentee' },
    { label: 'Login as Mentor', value: 'mentor' },
    { label: 'Login as Admin', value: 'admin' },
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
          value={userTypeLocal}
          onChange={(item) => setUserTypeLocal(item.value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={emailLocal}
          onChangeText={setEmailLocal}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={passwordLocal}
          onChangeText={setPasswordLocal}
        />
        <TouchableOpacity onPress={() => setIsForgotPassword(!isForgotPassword)}>
          <Text style={styles.toggleText}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
          <Text style={styles.buttonText}>
            {userTypeLocal === 'mentee'
              ? 'Sign In as Mentee'
              : userTypeLocal === 'mentor'
              ? 'Sign In as Mentor'
              : userTypeLocal === 'admin'
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
  },
});

export default SignInPage;
