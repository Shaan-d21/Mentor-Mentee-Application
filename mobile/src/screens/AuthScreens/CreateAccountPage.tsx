import React, { useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { changeStatusToInitial, registerUser } from '../../redux/slices/auth/sliceRegister';
import { ScreenProps } from '../../navigation/types';
import { authStyles } from './authStyle';

const CreateAccountPage: React.FC<ScreenProps<"CreateAccountPage">> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [userTypeLocal, setUserTypeLocal] = React.useState<string | null>(null);
  const [emailLocal, setEmailLocal] = React.useState('');
  const [passwordLocal, setPasswordLocal] = React.useState('');
  const [nameLocal, setNameLocal] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] =React.useState(false);

  const currentStatus = useSelector((state: RootState) => state.register.status);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleFormSubmit = () => {
    const isEmailValid = emailRegex.test(emailLocal);
    const isPasswordValid =
    passwordLocal.length >= 8 &&
    /[A-Z]/.test(passwordLocal) &&
    /[a-z]/.test(passwordLocal) &&
    /[0-9]/.test(passwordLocal) &&
    /[^a-zA-Z0-9\s]/.test(passwordLocal);
    const isNameValid = nameLocal.trim() !== '' && /^[a-zA-Z\s]+$/.test(nameLocal.trim());

    if (!isEmailValid && !isPasswordValid) {
      Alert.alert('Invalid Username and Password');
      return;
    }
    if (!isEmailValid) {
      Alert.alert('Invalid Email');
      return;
    }
    if (!isPasswordValid) {
      Alert.alert('Invalid Password'
        , '\nPassword must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }
    if (!userTypeLocal) {
      Alert.alert('Invalid User Type');
      return;
    }
    if (!isNameValid) {
      Alert.alert('Invalid Name', 'Name should only contain letters.');
      return;
    }

    // Dispatch the registerUser action
    dispatch(registerUser({
      email: emailLocal.toLowerCase(),
      password: passwordLocal,
      name: nameLocal,
      role: userTypeLocal as "mentee" | "mentor",
    }));
  };

  useEffect(() => {
    if (currentStatus === 'success') {
      dispatch(changeStatusToInitial())
      Alert.alert('Account Created Successfully!')
      navigation.replace('SignInPage');
    } else if (currentStatus === 'failed') {
      dispatch(changeStatusToInitial())
      Alert.alert('Registration Failed. Please try again.');
    }
  }, [currentStatus, navigation]);

  const userTypes = [
    { label: 'Register as Mentee', value: 'mentee' },
    { label: 'Register as Mentor', value: 'mentor' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Create Account</Text>
        <Dropdown
          style={authStyles.dropdown}
          data={userTypes}
          labelField="label"
          valueField="value"
          placeholder="Select Registration Role"
          value={userTypeLocal}
          onChange={(item) => setUserTypeLocal(item.value)}
        />
        <TextInput
          style={authStyles.input}
          placeholder="Name"
          value={nameLocal}
          onChangeText={setNameLocal}
        />
        <TextInput
          style={authStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={emailLocal}
          onChangeText={setEmailLocal}
        />
        {/* <TextInput
          style={authStyles.input}
          placeholder="Password"
          secureTextEntry
          value={passwordLocal}
          onChangeText={setPasswordLocal}
        /> */}
         <View style={authStyles.passwordContainer}>
                    <TextInput
                      style={authStyles.passwordInput}
                      placeholder="Password"
                      secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry
                      value={passwordLocal}
                      onChangeText={setPasswordLocal}
                    />
                    <TouchableOpacity
                      style={authStyles.eyeIconContainer}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                    >
                      <FontAwesomeIcon
                        icon={isPasswordVisible ? faEyeSlash : faEye} // Show eye or eye-slash icon
                        size={20}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
        <TouchableOpacity style={authStyles.button} onPress={handleFormSubmit}>
          <Text style={authStyles.buttonText}>
            {userTypeLocal === 'mentee'
              ? 'Sign Up as Mentee'
              : userTypeLocal === 'mentor'
              ? 'Sign Up as Mentor'
              : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignInPage')}>
          <Text style={authStyles.toggleText}>
            <Text style={{ color: 'gray' }}>Already have an account? </Text>
            <Text style={authStyles.toggleText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateAccountPage;