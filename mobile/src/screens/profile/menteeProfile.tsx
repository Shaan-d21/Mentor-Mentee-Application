import React, { FC, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';

import DropdownComponent from '../../components/Dropdown';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { MenteeProfile } from '../../types/MenteeProfileTypes';
import { getmenteeprofile, updateProfileData, updateprofileskill, } from '../../redux/slices/profileSlice/menteeProfileSlice';
import { ScreenProps } from '../../navigation/types';
import { setName } from '../../redux/slices/sliceLogin';
import { MMKV } from 'react-native-mmkv';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope, faBriefcase, faGraduationCap, faClock, faUser, faPhone, faCode, faChevronLeft, faEdit, faSave, faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { profileStyles } from './profileStyle';

import {changeProfileStatus} from '../../redux/slices/sliceLogin';
import AppBar from '../../components/appbar_component';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const MenteeProfileScreen: FC<ScreenProps<"MenteeProfileScreen">> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [designationError, setDesignationError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const profile_status = useSelector((state:RootState)=> state.login.profile_status);

  

  console.log('Profile status:', profile_status);
useEffect(() => {

  console.log('Profile status:', profile_status);
},[])

  const currentStatus = useSelector(
    (state: RootState) => state.menteeProfile.status,
  );
  const menteeProfileStatus = useSelector(
    (state: RootState) => state.menteeProfile.Menteeprofile_status,
  );
  const userType: MenteeProfile | undefined = useSelector(
    (state: RootState) => state.menteeProfile.response,
  );
  const dispatch = useDispatch<AppDispatch>();
  const storage = new MMKV();

  useEffect(() => {
    dispatch(getmenteeprofile());
  }, [dispatch]);

useEffect(() => {
  console.log('MenteeProfileStatus:', menteeProfileStatus);
  dispatch(changeProfileStatus(!!menteeProfileStatus));
}, [menteeProfileStatus]);

    // useEffect(() => {
    //   if (Mentorprofile_status) {
    //     dispatch(changeProfileStatus(Mentorprofile_status));
        
    //   }
    //   // dispatch(changeProfileStatus(true));
    // },[Mentorprofile_status])

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
      }
    } else if (currentStatus === 'failed') {
      console.log('Failed to fetch user profile data');
    }
  }, [currentStatus, userType]);

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
  const handleSubmit = () => {
    let isValid = true;

    // Validate name
    if (!fullName||!fullName.trim()) {
      setNameError('Name cannot be empty.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate email
    if (!email||!email.trim()) {
      setEmailError('Email cannot be empty.');
      isValid = false;
    } else if (!validateEmail()) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate phone
    if (!mobile||!mobile.trim()) {
      setMobileError('Mobile number cannot be empty.');
      isValid = false;
    } else if (!validateMobile(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Validate designation
    if (!designation||!designation.trim()) {
      setDesignationError('Designation cannot be empty.');
      isValid = false;
    } else {
      setDesignationError('');
    }

    // If valid, close edit mode and update profile
    if (isValid) {
      setIsEditing(false);
      dispatch(updateProfileData({
        name: fullName,
        contact: mobile,
        designation: designation
      }));
      dispatch(setName(fullName));
    }
  };

  function handleSkillSelection(value: string): void {
    setSelectedSkill(value);
    dispatch(updateprofileskill(value));
  }

  useEffect(() => {
    if (currentStatus === 'failed') {

      Alert.alert('Error', 'Failed to load Profile.', [
        {
          text: 'Retry',
          onPress: () => dispatch(getmenteeprofile()),
        },
        {
          text: 'Cancel',
          onPress: () => navigation.pop(),
          style: 'cancel',
        }
      ],
      );
    }
  }, [currentStatus]);

  return currentStatus === 'loading' ? (
    <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={profileStyles.container}>
      {
  
  profile_status? <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => {}} />
    : <>
    <TouchableOpacity
      style={profileStyles.backButton}
      onPress={() => {
        dispatch(getmenteeprofile());
      }}
    >
      {/* <FontAwesomeIcon icon={faChevronLeft} size={16} color="#fff" style={profileStyles.buttonIcon} /> */}
      <Text style={profileStyles.buttonText}>Refresh</Text>
    </TouchableOpacity>
    </>
  }
      <View style={profileStyles.profileContainer}>
        <View style={profileStyles.profileImageContainer}>
          <FontAwesomeIcon icon={faUserCircle} size={150} color="#3498db" style={profileStyles.profileImage} />
        </View>

        <View style={profileStyles.infoContainer}>
          {!isEditing ? (
            <View style={profileStyles.profileInfoSection}>
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faUser} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{fullName}</Text>
              </View>

              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faEnvelope} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{email}</Text>
              </View>

              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faPhone} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{mobile}</Text>
              </View>

              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faBriefcase} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{designation}</Text>
              </View>
            </View>
          ) : (
            <>
              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faUser} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <TextInput
                  style={[
                    profileStyles.inputField,
                    nameError ? profileStyles.inputError : undefined,
                  ]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                />
              </View>
              {nameError ? (
                <Text style={profileStyles.errorText}>{nameError}</Text>
              ) : null}

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faEnvelope} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <Text style={[profileStyles.inputField, profileStyles.disabledInput]}>
                  {email}
                </Text>
              </View>
              {emailError ? (
                <Text style={profileStyles.errorText}>{emailError}</Text>
              ) : null}

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faPhone} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <TextInput
                  style={[
                    profileStyles.inputField,
                    mobileError ? profileStyles.inputError : undefined,
                  ]}
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                />
              </View>
              {mobileError ? (
                <Text style={profileStyles.errorText}>{mobileError}</Text>
              ) : null}

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faBriefcase} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <TextInput
                  style={[
                    profileStyles.inputField,
                    designationError ? profileStyles.inputError : undefined,
                  ]}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder="Designation"
                />
              </View>
              {designationError ? (
                <Text style={profileStyles.errorText}>{designationError}</Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      {!!userType?.skillSet?.length && (
        <View style={profileStyles.domainsContainer}>
          <View style={profileStyles.sectionHeaderRow}>
            <FontAwesomeIcon icon={faCode} size={18} color="#3498db" />
            <Text style={profileStyles.domainsTitle}>Skills</Text>
          </View>
          <View style={profileStyles.domainsList}>
            {[...new Set(userType.skillSet)].map((skill: any, index: number) => (
              <View key={index} style={profileStyles.skillItem}>
                <Text style={profileStyles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={profileStyles.dropdownContainer}>
        <View style={profileStyles.sectionHeaderRow}>
          <FontAwesomeIcon icon={faCode} size={18} color="#3498db" />
          <Text style={profileStyles.domainsTitle}>Add New Skill</Text>
        </View>
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
          selectedValue={selectedSkill || ''}
          onSelect={handleSkillSelection}
          placeholder="Select Skills"
        />
      </View>

      <TouchableOpacity
        style={profileStyles.button}
        onPress={() => {
          if (isEditing) {
            handleSubmit();
          } else {
            handleEditToggle();
          }
        }}>
        <FontAwesomeIcon
          icon={isEditing ? faSave : faEdit}
          size={16}
          color="#fff"
          style={profileStyles.buttonIcon}
        />
        <Text style={profileStyles.buttonText}>
          {isEditing ? 'Save Profile' : 'Update Profile'}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[profileStyles.button, profileStyles.backButton]}
        onPress={() => {
          navigation.navigate('MenteeDashboard');
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={16} color="#fff" style={profileStyles.buttonIcon} />
        <Text style={profileStyles.buttonText}>Go Back</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};


export default MenteeProfileScreen;