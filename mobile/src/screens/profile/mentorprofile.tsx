//// filepath: c:\Users\Kavan\Desktop\Mentor-Mentee-Application\mobile\src\screens\profile\mentorprofile.tsx
// ...existing code...
import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import DropdownComponent from '../../components/Dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  getmentorprofile,
  updateMentorProfileData,
  updateMentorprofileskill,
} from '../../redux/slices/profileSlice/mentorProfileSlice';
import {Skill} from '../../types/MentorProfileTypes';
import {ScreenProps} from '../../navigation/types';
import {setName} from '../../redux/slices/auth/sliceLogin';
import {MMKV} from 'react-native-mmkv';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faBriefcase,
  faClock,
  faUser,
  faPhone,
  faCode,
  faEdit,
  faSave,
  faUserCircle,
  faUserGraduate,
  faPlusCircle,
  faTimes,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {mentorSpecificStyles, profileStyles} from './profileStyle';
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
  {
    label: 'Artificial Intelligence & Machine Learning',
    value: 'Artificial Intelligence & Machine Learning',
  },
  {label: 'Database & Backend', value: 'Database & Backend'},
  {label: 'Cloud Computing', value: 'Cloud Computing'},
  {label: 'DevOps & Deployment', value: 'DevOps & Deployment'},
  {label: 'Data Science & Analytics', value: 'Data Science & Analytics'},
  {label: 'Software Development', value: 'Software Development'},
  {label: 'Project & Team Management', value: 'Project & Team Management'},
  {label: 'Soft Skills', value: 'Soft Skills'},
  {label: 'Web Development', value: 'Web Development'},
];

// Full list of skills for the Add/Edit Skills modal:
const allSkills = [
  'Python',
  'Java',
  'JavaScript',
  'C++',
  'SQL',
  'Node JS',
  'SpringBoot',
  'AWS',
  'GCP',
  'Docker',
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'TensorFlow',
  'LangChain',
  'GenAI',
  'Data Analysis',
  'Big Data',
  'Data Structure',
  'Problem Solving',
  'Project Management',
  'Leadership',
  'Time Management',
  'Communication',
  'Public Speaking',
  'Critical Thinking',
  'Teamwork',
  'HTML',
  'CSS',
];

const MentorProfile: FC<ScreenProps<'MentorProfileScreen'>> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStatus = useSelector(
    (state: RootState) => state.mentorProfile.status,
  );
  const mentorData = useSelector(
    (state: RootState) => state.mentorProfile.response,
  );
  const Mentorprofile_status = useSelector(
    (state: RootState) => state.mentorProfile.Mentorprofile_status,
  );
  const profile_status = useSelector(
    (state: RootState) => state.login.profile_status,
  );

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [designationError, setDesignationError] = useState('');
  const [domainError, setDomainError] = useState('');

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
  const [isEditing, setIsEditing] = useState(false);

  // Show or hide the "Add / Edit Skills" modal
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // For tracking skill proficiency in the modal
  const [skillProficiencies, setSkillProficiencies] = useState<{
    [key: string]: number;
  }>({});
  const [skill, setSkill] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    dispatch(getmentorprofile());
  }, [dispatch]);

  useEffect(() => {
    if (currentStatus === 'loading') {
      console.log('Loading mentor profile data...');
    } else if (currentStatus === 'success' && mentorData) {
      const newExp =
        mentorData.exp !== null && mentorData.exp !== undefined
          ? mentorData.exp.toString()
          : '0';

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
      // Convert existing skillSet into a simple { [skillName]: level } map
      const skillMap: {[key: string]: number} = {};
      mentorData.skillSet?.forEach(item => {
        const skillName = item.name.trim();
        const level = parseInt(item.proficiency?.toString() || '0', 10) || 0;
        // Keep the highest level if duplicates
        if (!skillMap[skillName] || level > skillMap[skillName]) {
          skillMap[skillName] = level;
        }
      });
      setSkill(skillMap);
    } else if (currentStatus === 'failed') {
      Alert.alert('Error', 'Failed to load Profile.', [
        {
          text: 'Retry',
          onPress: () => dispatch(getmentorprofile()),
        },
        {
          text: 'Cancel',
          onPress: () => navigation.pop(),
          style: 'cancel',
        },
      ]);
    }
  }, [currentStatus, mentorData, navigation, dispatch]);

  useEffect(() => {
    if (Mentorprofile_status) {
      dispatch(changeProfileStatus(Mentorprofile_status));
    }
  }, [Mentorprofile_status, dispatch]);

  function handleChange<K extends keyof LocalMentorProfile>(
    key: K,
    value: LocalMentorProfile[K],
  ) {
    setProfile(prev => ({...prev, [key]: value}));
  }

  function validateMobile(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    let isValid = true;

    // Check name
    if (!profile.name.trim()) {
      setNameError('Name cannot be empty.');
      isValid = false;
    } else {
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

    // Check domain
    if (!updateDomain || !updateDomain.trim()) {
      setDomainError('Domain cannot be empty.');
      isValid = false;
    } else {
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

  // Called from inside the modal to change the state only (no dispatch yet).
  function handleSkillLevel(skill: string, level: number) {
    setSkillProficiencies(prev => ({
      ...prev,
      [skill]: level,
    }));
  }

  // When user clicks "Save" inside the modal, we dispatch updates for each skill
  function saveSkills() {
    setModalLoading(true);
    dispatch(
      updateMentorprofileskill({
        skills: skillProficiencies,
      }),
    ).then(() => {
      setModalLoading(false);
      setShowSkillModal(false);
    });
  }

  return currentStatus === 'loading' ? (
    <View
      style={[
        profileStyles.container,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <>
      <ScrollView contentContainerStyle={profileStyles.container}>
        {profile_status ? (
          <AppBar
            title={isEditing ? 'Edit Mentor Profile' : 'Mentor Profile'}
            onProfilePress={() => navigation.navigate('MentorProfileScreen')}
            openDrawer={() => {}}
          />
        ) : null}

        <View style={profileStyles.profileContainer}>
          <View style={profileStyles.profileImageContainer}>
            <FontAwesomeIcon
              icon={faUserCircle}
              size={150}
              color="#3498db"
              style={profileStyles.profileImage}
            />
          </View>

          <View style={profileStyles.infoContainer}>
            {!isEditing ? (
              <View style={profileStyles.profileInfoSection}>
                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>{profile.name}</Text>
                </View>

                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>{profile.mail}</Text>
                </View>

                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>{profile.contact}</Text>
                </View>

                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faClock}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>
                    {profile.exp} years
                  </Text>
                </View>

                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>
                    {profile.designation}
                  </Text>
                </View>

                <View style={profileStyles.infoRow}>
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    size={18}
                    color="#3498db"
                    style={profileStyles.infoIcon}
                  />
                  <Text style={profileStyles.infoText}>{profile.domain}</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={18}
                    color="#3498db"
                    style={profileStyles.inputIcon}
                  />
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
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={18}
                    color="#3498db"
                    style={profileStyles.inputIcon}
                  />
                  <Text
                    style={[
                      profileStyles.inputField,
                      profileStyles.disabledInput,
                    ]}>
                    {profile.mail}
                  </Text>
                </View>

                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    size={18}
                    color="#3498db"
                    style={profileStyles.inputIcon}
                  />
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
                  <FontAwesomeIcon
                    icon={faClock}
                    size={18}
                    color="#3498db"
                    style={profileStyles.inputIcon}
                  />
                  <TextInput
                    style={profileStyles.inputField}
                    value={profile.exp}
                    keyboardType="numeric"
                    onChangeText={txt => handleChange('exp', txt)}
                    placeholder="Experience in Years"
                  />
                </View>

                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    size={18}
                    color="#3498db"
                    style={profileStyles.inputIcon}
                  />
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
                  <Text style={profileStyles.errorText}>
                    {designationError}
                  </Text>
                ) : null}

                <View style={mentorSpecificStyles.dropdownWrapper}>
                  <View style={mentorSpecificStyles.dropdownField}>
                    <DropdownComponent
                      data={domainOptions}
                      onSelect={setUpdateDomain}
                      selectedValue={updateDomain}
                      placeholder="Select Domain"
                    />
                  </View>
                </View>
                {domainError ? (
                  <Text style={profileStyles.errorText}>{domainError}</Text>
                ) : null}
              </>
            )}
          </View>
        </View>

        {/* Show read-only list of skills (already selected) */}
        {!!Object.keys(skill).length && (
          <View style={profileStyles.domainsContainer}>
            <View style={profileStyles.sectionHeaderRow}>
              <FontAwesomeIcon icon={faCode} size={18} color="#3498db" />
              <Text style={profileStyles.domainsTitle}>Skills</Text>
            </View>
            <View style={profileStyles.domainsList}>
              {Object.keys(skill).map(skillName => (
                <View key={skillName} style={profileStyles.skillItem}>
                  <Text style={profileStyles.skillText}>{skillName}</Text>
                  <View style={mentorSpecificStyles.skillLevel}>
                    <Text style={mentorSpecificStyles.levelText}>
                      Level {skill[skillName]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* A single button to open a modal for adding/editing skills */}
    {isEditing?(<></>):(
        <TouchableOpacity
          style={[
            profileStyles.button,
            {flexDirection: 'row', alignItems: 'center'},
          ]}
          onPress={() => {
            setSkillProficiencies(skill);
            setShowSkillModal(true)}}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            size={16}
            color="#fff"
            style={{marginRight: 8}}
          />
          <Text style={profileStyles.buttonText}>Add / Edit Skills</Text>
        </TouchableOpacity>
)}
    
        {/* Button for editing profile vs saving profile */}
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
      </ScrollView>

      {/* Modal for adding/editing skill levels */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSkillModal}
        onRequestClose={() => setShowSkillModal(false)}>
        <View style={mentorSpecificStyles.modalBackground}>
          <View style={mentorSpecificStyles.modalContainer}>
            <Text style={mentorSpecificStyles.modalTitle}>
              Add / Edit Skills
            </Text>

            <ScrollView style={{maxHeight: 300, width: '100%'}}>
              {allSkills.map(skillName => {
                const currentLevel = skillProficiencies[skillName] || 0;
                return (
                  <View
                    key={skillName}
                    style={[
                      mentorSpecificStyles.radioRow,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text style={mentorSpecificStyles.skillLabel}>
                      {skillName}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      {[1, 2, 3].map(level => (
                        <TouchableOpacity
                          key={level}
                          style={mentorSpecificStyles.radioButton}
                          onPress={() => handleSkillLevel(skillName, level)}>
                          <View
                            style={[
                              mentorSpecificStyles.radioCircle,
                              currentLevel === level &&
                                mentorSpecificStyles.radioCircleSelected,
                            ]}
                          />
                          <Text>Lv {level}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity
                style={[
                  profileStyles.button,
                  {marginRight: 10, backgroundColor: '#7f8c8d'},
                ]}
                onPress={() => setShowSkillModal(false)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size={16}
                  color="#fff"
                  style={profileStyles.buttonIcon}
                />
                <Text style={profileStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[profileStyles.button, {marginLeft: 10}]}
                onPress={saveSkills}>
                {modalLoading ? (
                  <ActivityIndicator
                  color={'#fff'}
                  />


                ):(
                <> 
                  <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={16}
                  color="#fff"
                  style={profileStyles.buttonIcon}
                />
                
                  <Text style={profileStyles.buttonText}>Save</Text>
 </>
)}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MentorProfile;
