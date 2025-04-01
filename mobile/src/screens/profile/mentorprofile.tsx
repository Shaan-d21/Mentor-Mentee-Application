//// filepath: c:\Users\Kavan\Desktop\Mentor-Mentee-Application\mobile\src\screens\profile\mentorprofile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DropdownComponent from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getmentorprofile, updateMentorProfileData, updateMentorprofileskill } from '../../redux/slices/mentorProfileSlice';
import { MentorProfiletype, Skill } from '../../types/MentorProfileTypes';
import AppBar from '../../components/appbar_component';

interface LocalMentorProfile {
  name: string;
  mail: string;
  role: string;
  exp: string;         // we'll convert numeric exp from server to string locally
  github_id: string;
  contact: string;
  gender: string;
  skillSet: Skill[];
}

export default function MentorProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const currentStatus = useSelector((state: RootState) => state.mentorProfile.status);
  const mentorData = useSelector((state: RootState) => state.mentorProfile.response);

  const [profile, setProfile] = useState<LocalMentorProfile>({
    name: '',
    mail: '',
    role: 'mentor',
    exp: '0',
    github_id: '',
    contact: '',
    gender: 'male',
    skillSet: [],
  });

  const [imageUri, setImageUri] = useState(
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format'
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyModal, setProficiencyModal] = useState(false);

  useEffect(() => {
    dispatch(getmentorprofile());
  }, [dispatch]);

  useEffect(() => {
    if (currentStatus === 'loading') {
      console.log('Loading mentor profile data...');
    } else if (currentStatus === 'success' && mentorData) {
      // Convert numeric exp to a string for the text input
      // and set default images by gender
      const newExp = mentorData.exp !== null ? mentorData.exp.toString() : '0';
      setProfile({
        name: mentorData.name || '',
        mail: mentorData.mail || '',
        role: mentorData.role || 'mentor',
        exp: newExp,
        github_id: mentorData.github_id || '',
        contact: mentorData.contact || '',
        gender: mentorData.gender || '',
        skillSet: mentorData.skillSet || [],
      });

      if (mentorData.gender === 'female') {
        setImageUri('https://cdn-icons-png.flaticon.com/512/146/146005.png');
      } else if (mentorData.gender === 'male') {
        setImageUri('https://cdn-icons-png.flaticon.com/512/146/146007.png');
      } else {
        setImageUri('https://cdn-icons-png.flaticon.com/512/149/149071.png');
      }
    } else if (currentStatus === 'failed') {
      console.log('Failed to fetch mentor profile data');
    }
  }, [currentStatus, mentorData]);

  function handleChange<K extends keyof LocalMentorProfile>(key: K, value: LocalMentorProfile[K]) {
    setProfile(prev => ({ ...prev, [key]: value }));
  }

  // Handle skill selection
  function handleSkillSelection(skill: string) {
    setSelectedSkill(skill);
    setProficiencyModal(true);
  }

  // Save skill with chosen proficiency
  function handleProficiencySelection(proficiency: number) {
    if (selectedSkill) {
      dispatch(updateMentorprofileskill({ skill: selectedSkill, level: proficiency.toString() }));
    }
    setProficiencyModal(false);
    setSelectedSkill(null);
  }

  // save method
  function handleSaveChanges() {


    dispatch(updateMentorProfileData({contact: profile.contact,
      exp:profile.exp,
      gender:profile.gender,github_id:profile.github_id,name:profile.name}));
  }

  return (
    currentStatus === 'loading' ? (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      ) : currentStatus === 'failed' ? (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Failed to load Profile.</Text>
        </View>
      ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <AppBar 
      
      onProfilePress={() => { }} openDrawer={() => { }} />

      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={{ uri: imageUri }} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={txt => handleChange('name', txt)}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={profile.mail}
        onChangeText={txt => handleChange('mail', txt)}
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Contact</Text>
      <TextInput
        style={styles.input}
        value={profile.contact}
        keyboardType="numeric"
        onChangeText={txt => handleChange('contact', txt)}
        placeholder="Enter your contact number"
      />

      <Text style={styles.label}>Experience (Years)</Text>
      <TextInput
        style={styles.input}
        value={profile.exp}
        keyboardType="numeric"
        onChangeText={txt => handleChange('exp', txt)}
        placeholder="Enter your experience in years"
      />

      <Text style={styles.label}>Github ID</Text>
      <TextInput
        style={styles.input}
        value={profile.github_id}
        onChangeText={txt => handleChange('github_id', txt)}
        placeholder="Enter your GitHub username"
      />

      <Text style={styles.label}>Gender</Text>
      <RNPickerSelect
        onValueChange={value => handleChange('gender', (value as string) || '')}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
        placeholder={{ label: 'Select Gender', value: '' }}
        value={profile.gender}
      />

      <Text style={styles.label}>Add a Skill</Text>
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
        selectedValue=""
        onSelect={handleSkillSelection}
        placeholder="Select a skill"
      />

      {profile.skillSet.length > 0 && (
        <View style={styles.selectedSkillsContainer}>
          {profile.skillSet.map((item, index) => (
            <Text key={index} style={styles.selectedSkillText}>
              {item.name} — Level: {item.proficiency}
            </Text>
          ))}
        </View>
      )}

      <Modal visible={proficiencyModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select proficiency for {selectedSkill}</Text>
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

      <View style={{ marginTop: 20 }}>
        <Button title="Save Changes" onPress={handleSaveChanges} />
      </View>
    </ScrollView>
  ));
}

const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CAF0F8',
  },
  appbar:{
width: '100%'
  },
  label: {
    width: '90%',
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 10,
  },
  
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 170,
    height: 200,
    marginTop: 16,
    overflow: 'hidden',
  },
  selectedSkillsContainer: {
    width: '90%',
    marginTop: 10,
  },
  selectedSkillText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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