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
import {useDispatch, useSelector} from 'react-redux';
import { changeStatusToInitial, loginUser } from '../../redux/slices/auth/sliceLogin';
import { AppDispatch, RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';
import { current } from '@reduxjs/toolkit';
import { authStyles } from './authStyle';

const SignInPage: React.FC<ScreenProps<"SignInPage">> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [emailLocal, setEmailLocal] = React.useState('');
  const [passwordLocal, setPasswordLocal] = React.useState('');
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const userType= useSelector((state:RootState)=> state.login.role);
  const currentStatus= useSelector((state:RootState)=> state.login.status);
  const profileStatus= useSelector((state:RootState)=> state.login.profile_status);
  const profileStatus= useSelector((state:RootState)=> state.login.profile_status);

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
    
    const email= emailLocal.toLowerCase();

    dispatch(loginUser({email:email, password:passwordLocal}));
  };

  useEffect(()=>{
    if (currentStatus === 'success') {
      
      switch (userType) {
        case 'mentor':
          if(profileStatus === false) {
            navigation.replace('MentorProfileScreen');
          break;
          }
        navigation.replace('MentorDashboard');
          break;
        case 'mentee':
          if(profileStatus === false) {
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
    }
    else if(currentStatus === 'failed'){
      Alert.alert(
        'Alert Title',
        'Invalid Credentials',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.pop()
              console.log('Cancel Pressed')
              setEmailLocal('')
              setPasswordLocal('')
              dispatch(changeStatusToInitial());
      
            },
          }
        ]
      )
      
    }
  },[userType, currentStatus])
  

  return (
    currentStatus === 'loading' ? (
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
          keyboardType="email-address"
          value={emailLocal}
          onChangeText={setEmailLocal}
        />
        <TextInput
          style={authStyles.input}
          placeholder="Password"
          secureTextEntry
          value={passwordLocal}
          onChangeText={setPasswordLocal}
        />
        <TouchableOpacity
          onPress={() => setIsForgotPassword(!isForgotPassword)}>
          <Text style={authStyles.toggleText}>Forgot your password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={authStyles.button} onPress={handleFormSubmit}>
          <Text style={authStyles.buttonText}>
            {'Sign In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateAccountPage')}>
          <Text style={authStyles.toggleText}>
            <Text style={{color: 'gray'}}>Don't have an account? </Text>
            <Text style={authStyles.toggleText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  ));
};

export default SignInPage;
