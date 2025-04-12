import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DropdownComponent from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  getmentorprofile,
  updateMentorProfileData,
  updateMentorprofileskill,
} from '../../redux/slices/profileSlice/mentorProfileSlice';
import { Skill } from '../../types/MentorProfileTypes';
import { ScreenProps } from '../../navigation/types';
import {  setName } from '../../redux/slices/auth/sliceLogin';
import { MMKV } from 'react-native-mmkv';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faEnvelope, 
  faBriefcase, 
  faGraduationCap, 
  faClock, 
  faUser, 
  faPhone, 
  faCode, 
  faLayerGroup,
  faChevronLeft,
  faEdit,
  faSave,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { mentorSpecificStyles, profileStyles } from './profileStyle';
import AppBar from '../../components/appbar_component';
import {changeProfileStatus} from '../../redux/slices/auth/sliceLogin';

interface LocalMentorProfile {
  name: string;
  mail: string;
  exp: string;
  contact: string;
  skillSet: Skill[];
  designation: string;
  domain: string;
}

const domainOptions = [
  { label: 'Database & Backend', value: 'Database & Backend' },
  { label: 'Cloud Computing', value: 'Cloud Computing' },
  { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
  { label: 'Artificial Intelligence & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
  { label: 'Data Science & Analytics', value: 'Data Science & Analytics' },
  { label: 'Software Development', value: 'Software Development' },
  { label: 'Project & Team Management', value: 'Project & Team Management' },
  { label: 'Soft Skills', value: 'Soft Skills' },
  { label: 'Web Development', value: 'Web Development' },
];

const MentorProfile: FC<ScreenProps<'MentorProfileScreen'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStatus = useSelector(
    (state: RootState) => state.mentorProfile.status,
  );
  const mentorData = useSelector((state: RootState) => state.mentorProfile.response);
  const Mentorprofile_status = useSelector(
    (state: RootState) => state.mentorProfile.Mentorprofile_status,)
  const profile_status = useSelector((state:RootState)=> state.login.profile_status);
  console.log(`profile status is at mentorProfile ${profile_status}`)

  // Separate error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [designationError, setDesignationError] = useState('');

  const [profile, setProfile] = useState<LocalMentorProfile>({
    name: '',
    mail: '',
    exp: '0',
    contact: '',
    skillSet: [],
    designation: '',
    domain: '',
  });
  
  const [updateDomain, setUpdateDomain] = useState(profile.domain);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyModal, setProficiencyModal] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // const storage = new MMKV();

  useEffect(() => {
    dispatch(getmentorprofile());
  }, [dispatch]);

  useEffect(() => {
    if (currentStatus === 'loading') {
      console.log('Loading mentor profile data...');
    } else if (currentStatus === 'success' && mentorData) {
      const newExp = mentorData.exp !== null ? mentorData.exp.toString() : '0';
      setProfile({
        name: mentorData.name || '',
        mail: mentorData.mail || '',
        exp: newExp,
        contact: mentorData.contact || '',
        skillSet: mentorData.skillSet || [],
        designation: mentorData.designation,
        domain: mentorData.domain,
      });
      setUpdateDomain(mentorData.domain);
    } else if (currentStatus === 'failed')
       {
      Alert.alert('Error', 'Failed to load Profile.', [
        {
          text: 'Retry',
          onPress: () => dispatch(getmentorprofile()),
        },
        {
          text: 'Cancel',
          onPress: () => navigation.pop(),
          style: 'cancel',
        }
      ],
    );    }
  }, [currentStatus, mentorData]);

  useEffect(() => {
    if (Mentorprofile_status) {
      dispatch(changeProfileStatus(Mentorprofile_status));
      
    }
    // dispatch(changeProfileStatus(true));
  },[Mentorprofile_status])


  function handleChange<K extends keyof LocalMentorProfile>(
    key: K,
    value: LocalMentorProfile[K],
  ) {
    setProfile(prev => ({ ...prev, [key]: value }));
  }

  function handleSkillSelection(skill: string) {
    setSelectedSkill(skill);
    setProficiencyModal(true);
  }

  function handleProficiencySelection(proficiency: number) {
    if (selectedSkill) {
      dispatch(
        updateMentorprofileskill({
          skill: selectedSkill,
          level: proficiency.toString(),
        }),
      );
    }
    setProficiencyModal(false);
    setSelectedSkill(null);
  }

  const validateEmail = (): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(profile.mail);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    console.log('Submitting profile data:', profile);console.log('updateDomain:', updateDomain);
    let isValid = true;

    // Check name
    if (!profile.name.trim()) {
      setNameError('Name cannot be empty.');
      isValid = false;
    }
    
    else {
      setNameError('');
    }

    // Check contact
    if (!profile.contact.trim()) {
      setMobileError('Mobile number cannot be empty.');
      isValid = false;
    } else if (!validateMobile(profile.contact)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Check designation
    if (!profile.designation || !profile.designation.trim()) {
      setDesignationError('Designation cannot be empty.');
      isValid = false;
    } else {
      setDesignationError('');
    }
    if(!updateDomain || !updateDomain.trim()) {
      setDomainError('Domain cannot be empty.');
      isValid = false;
    }else{
      setDomainError('');
    }

    // If validations pass, save the profile
    if (isValid) {
      setIsEditing(false);
      dispatch(
        updateMentorProfileData({
          name: profile.name,
          exp: profile.exp,
          contact: profile.contact,
          designation: profile.designation,
          domain: updateDomain,
        }),
      );
      dispatch(setName(profile.name));
    }
  };

  return currentStatus === 'loading' ? (
    <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>

    
  ) : (
    <ScrollView contentContainerStyle={profileStyles.container}>
{
  
profile_status? <AppBar 
title= {isEditing ? 'Mentor Profile Edit' : 'Mentor Profile'} 
onProfilePress={() => navigation.navigate('MentorProfileScreen')} openDrawer={() => {}} />
  : <></>
}
      <View style={profileStyles.profileContainer}>
        <View style={profileStyles.profileImageContainer}>
           <FontAwesomeIcon icon={ faUserCircle} size={150} color="#3498db" style={profileStyles.profileImage} />
        </View>

        <View style={profileStyles.infoContainer}>
          {!isEditing ? (
            <View style={profileStyles.profileInfoSection}>
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faUser} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.name}</Text>
              </View>
              
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faEnvelope} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.mail}</Text>
              </View>
              
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faPhone} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.contact}</Text>
              </View>
              
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faClock} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.exp} years</Text>
              </View>
              
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faBriefcase} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.designation}</Text>
              </View>
              
              <View style={profileStyles.infoRow}>
                <FontAwesomeIcon icon={faLayerGroup} size={18} color="#3498db" style={profileStyles.infoIcon} />
                <Text style={profileStyles.infoText}>{profile.domain}</Text>
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
                  value={profile.name}
                  onChangeText={txt => handleChange('name', txt)}
                  placeholder="Full Name"
                />
              </View>
              {nameError ? (
                <Text style={profileStyles.errorText}>{nameError}</Text>
              ) : null}

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faEnvelope} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <Text style={[profileStyles.inputField, profileStyles.disabledInput]}>
                  {profile.mail}
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
                  value={profile.contact}
                  keyboardType="phone-pad"
                  onChangeText={txt => handleChange('contact', txt)}
                  placeholder="Mobile Number"
                />
              </View>
              {mobileError ? (
                <Text style={profileStyles.errorText}>{mobileError}</Text>
              ) : null}

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faClock} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <TextInput
                  style={profileStyles.inputField}
                  value={profile.exp}
                  keyboardType="numeric"
                  onChangeText={txt => handleChange('exp', txt)}
                  placeholder="Experience in Years"
                />
              </View>

              <View style={profileStyles.inputContainer}>
                <FontAwesomeIcon icon={faBriefcase} size={18} color="#3498db" style={profileStyles.inputIcon} />
                <TextInput
                  style={[
                    profileStyles.inputField,
                    designationError ? profileStyles.inputError : undefined,
                  ]}
                  value={profile.designation}
                  onChangeText={txt => handleChange('designation', txt)}
                  placeholder="Designation"
                />
              </View>
              {designationError ? (
                <Text style={profileStyles.errorText}>{designationError}</Text>
              ) : null}

              <View style={mentorSpecificStyles.dropdownWrapper}>
                <View style={mentorSpecificStyles.dropdownField}>
                  <DropdownComponent data={domainOptions} onSelect={setUpdateDomain} selectedValue={updateDomain} placeholder='Select Domain' />
                </View>
             
              </View>
              {domainError ? (
                <Text style={profileStyles.errorText}>{domainError}</Text>
              ) : null}

              <View style={mentorSpecificStyles.dropdownWrapper}>
                <View style={mentorSpecificStyles.dropdownField}>
                  <DropdownComponent data={domainOptions} onSelect={setUpdateDomain} selectedValue={updateDomain} placeholder='Select Domain' />
                </View>
              </View>
              {domainError ? (
                <Text style={profileStyles.errorText}>{domainError}</Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      {!!profile.skillSet?.length && (
        <View style={profileStyles.domainsContainer}>
          <View style={profileStyles.sectionHeaderRow}>
            <FontAwesomeIcon icon={faCode} size={18} color="#3498db" />
            <Text style={profileStyles.domainsTitle}>Skills</Text>
          </View>
          <View style={profileStyles.domainsList}>
            {Array.from(
              profile.skillSet.reduce((map, item) => {
                const nameKey = item.name.trim().toLowerCase();
                const currentProf = Number(item.proficiency) || 0;
                const existing = map.get(nameKey);
                if (!existing || currentProf > Number(existing.proficiency)) {
                  // Keep highest proficiency for this skill name
                  map.set(nameKey, { ...item, proficiency: String(currentProf) });
                }
                return map;
              }, new Map()).values()
            ).map((item, index) => (
              <View key={index} style={profileStyles.skillItem}>
                <Text style={profileStyles.skillText}>
                  {item.name}
                </Text>
                <View style={mentorSpecificStyles.skillLevel}>
                  <Text style={mentorSpecificStyles.levelText}>Level {item.proficiency}</Text>
                </View>
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
          placeholder="Select Skill"
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
        }}
      >
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
          navigation.navigate('MentorDashboard');
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={16} color="#fff" style={profileStyles.buttonIcon} />
        <Text style={profileStyles.buttonText}>Go Back</Text>
      </TouchableOpacity> */}

      <Modal visible={proficiencyModal} transparent animationType="slide">
        <View style={mentorSpecificStyles.modalBackground}>
          <View style={mentorSpecificStyles.modalContainer}>
            <Text style={mentorSpecificStyles.modalTitle}>
              Select proficiency for {selectedSkill}
            </Text>
            {[1, 2, 3].map(level => (
              <TouchableOpacity
                key={level}
                style={mentorSpecificStyles.proficiencyButton}
                onPress={() => handleProficiencySelection(level)}
              >
                <Text style={mentorSpecificStyles.proficiencyText}>Level {level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


export default MentorProfile;