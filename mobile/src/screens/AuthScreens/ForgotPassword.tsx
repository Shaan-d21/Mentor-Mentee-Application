import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScreenProps } from '../../navigation/types';
import { authStyles } from './authStyle';
import { apiVerifyEmail } from '../../services/apiForgotPassword';

const ForgotPassword: React.FC<ScreenProps<'ForgotPassword'>> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
const response = await apiVerifyEmail(email);
        if (response && response.status_code == 200) {

      Alert.alert(
        'OTP Sent',
        "We've sent a verification code to your email id.",
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('OTPVerification', { email }),
          },
        ]
      );
    }else {
        Alert.alert('Error', 'Email not found. Please check your email address.');
    }
}
catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Forgot Password</Text>
      

        <TextInput
          style={authStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity 
          style={[
            authStyles.button,
            !email && authStyles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!email || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={authStyles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={authStyles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={authStyles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;