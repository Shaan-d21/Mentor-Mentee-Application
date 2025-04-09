import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AppBar from '../../components/appbar_component';
import { Dropdown } from 'react-native-element-dropdown';
import DropdownComponent from '../../components/Dropdown';
import { apigetMenteeProfile, apiUpdateMenteeProfile } from '../../services/apimenteeprofile';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { MenteeProfile } from '../../types/MenteeProfileTypes';
import {
  getmenteeprofile,
  updateProfileData,
  updateprofileskill,
} from '../../redux/slices/menteeProfileSlice';
import { ScreenProps } from '../../navigation/types';
import { setName } from '../../redux/slices/sliceLogin';
import { MMKV } from 'react-native-mmkv';

const MenteeProfileScreen: FC<ScreenProps<"MenteeProfileScreen">> = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dError, setDError] = useState('');


  const [_imageUri, setImageUri] = useState(
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  );

  const currentStatus = useSelector(
    (state: RootState) => state.menteeProfile.status,
  );
  const userType: MenteeProfile | undefined = useSelector(
    (state: RootState) => state.menteeProfile.response,
  );
  const dispatch = useDispatch<AppDispatch>();
  const storage = new MMKV();
  useEffect(() => {
    storage.set(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTb2hhbSIsImlkIjo0MSwicm9sZSI6Im1lbnRlZSIsImV4cCI6MTc0NTM3NDczNn0.u9zV2VgLunICWmNOmtA7zMn2Nb-tBxmV14VlLFN8UaU',
    );
    dispatch(getmenteeprofile());
  }, [dispatch]);

  useEffect(() => {
    if (currentStatus === 'loading') {
      console.log('Loading user profile data...');
    }
    if (currentStatus === 'success') {
      console.log('User profile data:', userType);
      if (userType) {
        setFullName(userType.name);
        setEmail(userType.mail);
        setMobile(userType.contact);
        setDesignation(userType.designation);
        // if (genderLocal == "female") {
        //   setImageUri("https://cdn-icons-png.flaticon.com/512/146/146005.png");
        // }
        // else if (genderLocal == "male") {
        //   setImageUri("https://cdn-icons-png.flaticon.com/512/146/146007.png");
        // }
        // else if (genderLocal == "other") {
        //   setImageUri("https://cdn-icons-png.flaticon.com/512/149/149071.png");
        // }
      }
    } else if (currentStatus === 'failed') {
      console.log('Failed to fetch user profile data');
    }
  }, [currentStatus, userType]);

 

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else if (response.assets) {
          const selectedImage = response.assets[0]?.uri || '';
          // setImageUri(selectedImage);
        }
      },
    );
  };

  // Email validation
  const validateEmail = (): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Mobile validation
  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  // Toggles edit mode on/off
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Validates and saves data
  const handleSubmit= () => {
    setIsFocused(true);
    let isValid = true;

    if (!validateEmail()) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (!designation.trim()) {
      setDError('Designation cannot be empty');
      isValid = false;
    } else {
      setDError('');
    }
    if (!validateMobile(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    // If valid, close edit mode
    if (isValid) {
      setIsEditing(false);
      
    dispatch(updateProfileData({
      name:fullName, 
      contact: mobile,
      designation: designation
    }));
    dispatch(setName(fullName))
    }
  };

  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  function handleDomainSelection(value: string): void {
    setSelectedDomain(value);
    dispatch(updateprofileskill(value));
  }
  useEffect(() => {
    if (currentStatus === 'failed') {
      Alert.alert(
        'Login Failed',
        'Invalid Credentials',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.pop();
              console.log('Navigated back due to error');
            },
          },
        ],
      );
    }
  }, [currentStatus]);

  return currentStatus === 'loading' ? (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading Profile...</Text>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <AppBar onProfilePress={() => { }} openDrawer={() => { }} /> */}
      
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image style={styles.profileImage} source={{ uri: _imageUri }} />
        </View>

        <View style={styles.infoContainer}>
          {!isEditing ? (
            <>
              <Text style={styles.profileText}>Full Name: {fullName}</Text>
              <Text style={styles.profileText}>Email: {email}</Text>
              <Text style={styles.profileText}>Mobile: {mobile}</Text>
              <Text style={styles.profileText}>Designation: {designation}</Text>
            </>
          ) : (
            <>
            <Text >Full Name</Text>
              <TextInput
                style={styles.infoText}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
              />
            <Text >Email</Text>
              <Text style={[styles.infoText, emailError && styles.inputError]}> {email}</Text>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
                <Text >Mobile</Text>
              <TextInput
                style={[styles.infoText, mobileError && styles.inputError]}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
              />
              {mobileError ? (
                <Text style={styles.errorText}>{mobileError}</Text>
              ) : null}
              <Text >Designation </Text>
              <TextInput
                style={styles.infoText}
                value={designation}
                onChangeText={setDesignation}
                placeholder="Designation"
              />
               {dError ? (
                <Text style={styles.errorText}>{dError}</Text>
              ) : null}

              {/* <View style={styles.genderPickerContainer}>
                <Dropdown
                  style={styles.dropdown}
                  data={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    // { label: 'Other', value: 'other' },
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Gender"
                  value={genderLocal}
                  onChange={item => setGenderLocal(item.value)}
                />
              </View> */}
            </>
          )}
        </View>
      </View>

      {/* {!!userType?.skillSet?.length && (
        <View style={styles.domainsContainer}>
          <Text style={styles.domainsTitle}>Skills</Text>
          <View style={styles.domainsList}>
            {userType.skillSet.map((skill: any, index: number) => (
              <View key={index} style={styles.domainItem}>
                <Text style={styles.domainText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )} */}
      {!!userType?.skillSet?.length && (
        <View style={styles.domainsContainer}>
          <Text style={styles.domainsTitle}>Skills</Text>
          <View style={styles.domainsList}>
            {[...new Set(userType.skillSet)].map((skill: any, index: number) => (
              <View key={index} style={styles.domainItem}>
                <Text style={styles.domainText}>{skill}</Text>
              </View>
            ))}
        </View>
      </View>
)}

      <View style={styles.dropdownContainer}>
        <DropdownComponent
          data={[
            { label: 'JavaScript', value: 'JavaScript' },
            { label: 'Python', value: 'Python' },
            { label: 'Java', value: 'Java' },
            { label: 'C++', value: 'C++' },
            { label: 'React', value: 'React' },
            { label: 'Node.js', value: 'Node.js' },
            { label: 'SQL', value: 'SQL' },
            { label: 'Machine Learning', value: 'Machine Learning' },
            { label: 'Data Science', value: 'Data Science' },
            { label: 'Cybersecurity', value: 'Cybersecurity' },
          ]}
          selectedValue={selectedDomain || ''}
          onSelect={handleDomainSelection}
          placeholder="Select Skills"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isEditing) {
            handleSubmit();
          } else {
            handleEditToggle();
          }
        }}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Profile' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('MenteeDashboard');
        }}  
      >
        <Text style={styles.buttonText}>
          Go Back
        </Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 10,
    zIndex: 10,
  },
  profileContainer: {
    marginTop: 16,
    flexDirection: 'column',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 170,
    height: 200,
    marginBottom: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  domainsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  domainsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  domainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
    margin: 4,
    borderRadius: 4,
  },
  domainText: {
    marginRight: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  companyInput: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    backgroundColor: '#eee',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  infoContainer: {
    marginTop: 16,
    flex: 1,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  genderPickerContainer: {
    marginBottom: 16,
  },
  domainsContainer: {
    marginBottom: 16,
  },
  profileText: {
    backgroundColor: '#eee',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenteeProfileScreen;