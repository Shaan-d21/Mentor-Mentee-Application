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
} from 'react-native';
import DropdownComponent from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  getmentorprofile,
  updateMentorProfileData,
  updateMentorprofileskill,
} from '../../redux/slices/mentorProfileSlice';
import { Skill } from '../../types/MentorProfileTypes';
import { ScreenProps } from '../../navigation/types';
import { setName } from '../../redux/slices/sliceLogin';
import { MMKV } from 'react-native-mmkv';

interface LocalMentorProfile {
  name: string;
  mail: string;
  exp: string;
  contact: string;
  skillSet: Skill[];
  designation: string;
}

const MentorProfile: FC<ScreenProps<'MentorProfileScreen'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStatus = useSelector(
    (state: RootState) => state.mentorProfile.status,
  );
  const mentorData = useSelector((state: RootState) => state.mentorProfile.response);

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
  });

  const [_imageUri] = useState(
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format',
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyModal, setProficiencyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const storage = new MMKV();

  useEffect(() => {
    // storage.set(
    //   'token',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MzY4NTE0fQ.rqFMnkss6Vq2l-8Q1r0kGQ78rvOBRk1KF6b0egQYHCY',
    // );
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
      });
    } else if (currentStatus === 'failed') {
      console.log('Failed to fetch mentor profile data');
    }
  }, [currentStatus, mentorData]);

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
    if (!profile.designation.trim()) {
      setDesignationError('Designation cannot be empty.');
      isValid = false;
    } else {
      setDesignationError('');
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
        }),
      );
      dispatch(setName(profile.name));
    }
  };

  return currentStatus === 'loading' ? (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading Profile...</Text>
    </View>
  ) : currentStatus === 'failed' ? (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Failed to load Profile.</Text>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image style={styles.profileImage} source={{ uri: _imageUri }} />
        </View>

        <View style={styles.infoContainer}>
          {!isEditing ? (
            <>
              <Text style={styles.profileText}>Full Name: {profile.name}</Text>
              <Text style={styles.profileText}>Email: {profile.mail}</Text>
              <Text style={styles.profileText}>Mobile: {profile.contact}</Text>
              <Text style={styles.profileText}>
                Experience: {profile.exp} years
              </Text>
              <Text style={styles.profileText}>
                Designation: {profile.designation}
              </Text>
            </>
          ) : (
            <>
              <Text>Full Name</Text>
              <TextInput
                style={[
                  styles.infoText,
                  nameError ? styles.inputError : undefined,
                ]}
                value={profile.name}
                onChangeText={txt => handleChange('name', txt)}
                placeholder="Full Name"
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}

              <Text>Email</Text>
              <Text style={[styles.infoText, emailError && styles.inputError]}>
                {profile.mail}
              </Text>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <Text>Mobile</Text>
              <TextInput
                style={[
                  styles.infoText,
                  mobileError ? styles.inputError : undefined,
                ]}
                value={profile.contact}
                keyboardType="phone-pad"
                onChangeText={txt => handleChange('contact', txt)}
                placeholder="Mobile Number"
              />
              {mobileError ? (
                <Text style={styles.errorText}>{mobileError}</Text>
              ) : null}

              <Text>Experience (Years)</Text>
              <TextInput
                style={styles.infoText}
                value={profile.exp}
                keyboardType="numeric"
                onChangeText={txt => handleChange('exp', txt)}
                placeholder="Experience in Years"
              />

              <Text>Designation</Text>
              <TextInput
                style={[
                  styles.infoText,
                  designationError ? styles.inputError : undefined,
                ]}
                value={profile.designation}
                onChangeText={txt => handleChange('designation', txt)}
                placeholder="Designation"
              />
              {designationError ? (
                <Text style={styles.errorText}>{designationError}</Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      {!!profile.skillSet?.length && (
        <View style={styles.domainsContainer}>
          <Text style={styles.domainsTitle}>Skills</Text>
          <View style={styles.domainsList}>
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
              <Text key={index} style={styles.domainItem}>
                {item.name} — Level: {item.proficiency}
              </Text>
            ))}
// ...existing code...
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
          selectedValue={selectedSkill || ''}
          onSelect={handleSkillSelection}
          placeholder="Add Skills"
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
        }}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Profile' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('MentorDashboard');
        }}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      <Modal visible={proficiencyModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Select proficiency for {selectedSkill}
            </Text>
            {[1, 2, 3].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.proficiencyButton}
                onPress={() => handleProficiencySelection(level)}
              >
                <Text style={styles.proficiencyText}>Level {level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    borderWidth: 1,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  proficiencyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
    borderRadius: 5,
  },
  proficiencyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MentorProfile;