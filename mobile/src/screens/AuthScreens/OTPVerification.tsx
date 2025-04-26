import React, { useState, useEffect, useRef } from 'react';
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
import { apiVerifyEmail, apiVerifyOtp } from '../../services/apiForgotPassword';

const OTPVerification: React.FC<ScreenProps<'OTPVerification'>> = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text.length === 1 && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResendOtp = async () => {

    if (!canResend) return;
    setIsLoading(true);
    try {
      // API call would go here
      const response =await apiVerifyEmail(email);
      if(response && response.status_code===200){
      setTimer(59);
      setCanResend(false);
      Alert.alert('Success', 'OTP has been resent to your email');}
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP API call would go here
      const response = await apiVerifyOtp(email,otpString);
      if (response && response.status_code === 200) {
    navigation.replace('ResetPassword', { email });
  } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Verify OTP</Text>
        <Text style={authStyles.subtitle}>
          Enter the 4-digit code sent to {email}
        </Text>

        <View style={authStyles.otpContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={el => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              style={authStyles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={!canResend || isLoading}
          style={authStyles.resendContainer}>
          <Text
            style={[
              authStyles.resendText,
              !canResend && authStyles.resendTextDisabled,
            ]}>
            {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            authStyles.button,
            otp.join('').length !== 4 && authStyles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={otp.join('').length !== 4 || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={authStyles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={authStyles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={authStyles.backButtonText}>Back</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerification;