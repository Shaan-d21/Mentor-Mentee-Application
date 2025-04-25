import React, { useState,useEffect} from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ScreenProps } from '../../navigation/types';
import { authStyles } from './authStyle';
import { apiConfirmPassword } from '../../services/apiForgotPassword';

const ResetPassword: React.FC<ScreenProps<'ResetPassword'>> = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    length: true,
    capital: true,
    number: true,
    special: true,
    match: true,
  });

  useEffect(() => {
    const validations = {
      length: newPassword.length >= 8,
      capital: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      match: newPassword === confirmPassword,
    };
    setErrors(validations);
  }, [newPassword, confirmPassword]);

  const isPasswordValid = () => {
    return Object.values(errors).every(Boolean);
  };
  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setErrors(prev => ({
      ...prev,
      match: text === newPassword
    }));
  };

  const handleSubmit = async () => {
    if (!isPasswordValid()) {
      Alert.alert('Invalid Password', 'Please check all password requirements');
      return;
    }

    setIsLoading(true);
    try {
      // API call to reset password would go here
      const response = await apiConfirmPassword(newPassword);
        if (response && response.status_code === 200) {
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => navigation.navigate('SignInPage') }
      ]);}
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Reset Password</Text>
        <Text style={authStyles.subtitle}>Create a new password for your account</Text>

        <View style={authStyles.inputContainer}>
          <View style={authStyles.passwordContainer}>
            <TextInput
              style={authStyles.passwordInput}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              style={authStyles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>


          <View style={authStyles.passwordContainer}>
            <TextInput
              style={authStyles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity
              style={authStyles.eyeIconContainer}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={authStyles.validationContainer}>
            <Text style={[
              authStyles.validationText,
              errors.length ? authStyles.validationError : authStyles.validationSuccess
            ]}>
              • Must be at least 8 characters
            </Text>
            <Text style={[
              authStyles.validationText,
              errors.capital ? authStyles.validationError : authStyles.validationSuccess
            ]}>
              • Must contain a capital letter
            </Text>
            <Text style={[
              authStyles.validationText,
              errors.number ? authStyles.validationError : authStyles.validationSuccess
            ]}>
              • Must contain a number
            </Text>
            <Text style={[
              authStyles.validationText,
              errors.special ? authStyles.validationError : authStyles.validationSuccess
            ]}>
              • Must contain a special character
            </Text>
          </View>

          {confirmPassword.length > 0 && (
            <Text style={[
              authStyles.validationText,
              errors.match ? authStyles.validationError : authStyles.validationSuccess
            ]}>
              • Passwords must match
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            authStyles.button,
            (!isPasswordValid() || isLoading) && authStyles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isPasswordValid() || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={authStyles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;