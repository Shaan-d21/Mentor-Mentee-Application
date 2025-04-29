import React, { useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatusToInitial, loginUser } from '../../redux/slices/auth/sliceLogin';
import { AppDispatch, RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';
import { authStyles } from './authStyle';
import { useState } from 'react';

// ✅ Added
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';
import { useColorScheme } from 'react-native';

const SignInPage: React.FC<ScreenProps<'SignInPage'>> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const [emailLocal, setEmailLocal] = React.useState('');
  const [passwordLocal, setPasswordLocal] = React.useState('');
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // ✅ Added
  const [rememberMe, setRememberMe] = useState(false);

  const userType = useSelector((state: RootState) => state.login.role);
  const currentStatus = useSelector((state: RootState) => state.login.status);
  const profileStatus = useSelector((state: RootState) => state.login.profile_status);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // ✅ Modified: handle rememberMe persistence
  const handleFormSubmit = async () => {
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
  
    const email = emailLocal.toLowerCase();
  
    // ✅ Store rememberMe flag, email, and password
    if (rememberMe) {
      await AsyncStorage.setItem('rememberMe', 'true');
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', passwordLocal);
    } else {
      await AsyncStorage.removeItem('rememberMe');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
    }
  
    dispatch(loginUser({ email: email, password: passwordLocal }));
  };

  // ✅ Load rememberMe status on mount and pre-fill email/password if needed
  useEffect(() => {
    const checkRememberMe = async () => {
      const remembered = await AsyncStorage.getItem('rememberMe');
      if (remembered === 'true') {
        setRememberMe(true);
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail) setEmailLocal(savedEmail);
        if (savedPassword) setPasswordLocal(savedPassword);
      }
    };
    checkRememberMe();
  }, []);

  useEffect(() => {
    if (currentStatus === 'success') {
      switch (userType) {
        case 'mentor':
          if (profileStatus === false) {
            navigation.replace('MentorProfileScreen');
            break;
          }
          navigation.replace('MentorDashboard');
          break;
        case 'mentee':
          if (profileStatus === false) {
            navigation.replace('MenteeProfileScreen');
            break;
          }
          navigation.replace('MenteeDashboard');
          break;
        default:
          console.log('No user role found');
          break;
      }
      dispatch(changeStatusToInitial());
    } else if (currentStatus === 'failed') {
      Alert.alert('Alert Title', 'Invalid Credentials', [
        {
          text: 'OK',
          onPress: () => {
            navigation.pop();
            setEmailLocal('');
            setPasswordLocal('');
            dispatch(changeStatusToInitial());
          },
        },
      ]);
    }
  }, [userType, currentStatus]);

  return currentStatus === 'loading' ? (
    <View style={authStyles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Sign In</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#CCCCCC' : '#666666'}

          keyboardType="email-address"
          value={emailLocal}
          onChangeText={setEmailLocal}
        />

        {/* ✅ Password input with visibility toggle */}
        <View style={authStyles.passwordContainer}>
          <TextInput
            style={authStyles.passwordInput}
            placeholder="Password"
            placeholderTextColor={colorScheme === 'dark' ? '#CCCCCC' : '#666666'}

            secureTextEntry={!isPasswordVisible}
            value={passwordLocal}
            onChangeText={setPasswordLocal}
          />
          <TouchableOpacity
            style={authStyles.eyeIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
  style={authStyles.forgotPasswordContainer}
  onPress={() => navigation.navigate('ForgotPassword')}>
  
{/* // Navigate to Forgot Password screen */}
  <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
</TouchableOpacity>
{/* 
        // Custom Checkbox */}
<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
  <TouchableOpacity
    onPress={() => setRememberMe(!rememberMe)}
    style={{
      height: 20,
      width: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: rememberMe ? '#007AFF' : 'white',
    }}
  >
    {rememberMe && (
      <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
    )}
  </TouchableOpacity>
  <Text style={{ marginLeft: 8 }}>Remember Me</Text>
</View>

        <TouchableOpacity style={authStyles.button} onPress={handleFormSubmit}>
          <Text style={authStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CreateAccountPage')}>
          <Text style={authStyles.toggleText}>
            <Text style={{ color: 'gray' }}>Don't have an account? </Text>
            <Text style={authStyles.toggleText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignInPage;
