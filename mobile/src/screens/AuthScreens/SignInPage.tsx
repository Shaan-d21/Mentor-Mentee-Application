import React, { useEffect } from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import { loginUser } from '../../redux/slices/sliceLogin';
import { AppDispatch, RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';

const SignInPage: React.FC<ScreenProps<"SignInPage">> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [emailLocal, setEmailLocal] = React.useState('');
  const [passwordLocal, setPasswordLocal] = React.useState('');
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const userType= useSelector((state:RootState)=> state.login.response);
  const currentStatus= useSelector((state:RootState)=> state.login.status);

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

    dispatch(loginUser({email:emailLocal, password:passwordLocal}));

  };
  
  useEffect(() => {
    if (currentStatus === 'success') {
      switch (userType?.role) {
        case 'mentor':
          navigation.replace('MentorDashboard');
          break;
        case 'mentee':
          navigation.replace('MenteeDashboard');
          break;
        default:
          console.log('No user role found');
          break;
      }
    }
  }, [currentStatus, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
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
        <TouchableOpacity
          onPress={() => setIsForgotPassword(!isForgotPassword)}>
          <Text style={styles.toggleText}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
          <Text style={styles.buttonText}>
            {'Sign In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateAccountPage')}>
          <Text style={styles.toggleText}>
            <Text style={{color: 'gray'}}>Don't have an account? </Text>
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
    shadowOffset: {width: 0, height: 2},
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
