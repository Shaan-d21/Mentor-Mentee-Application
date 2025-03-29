import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';

const skillsList = [
  'React',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'Redux',
  'MongoDB',
  'Express.js',
  'SQL',
  'Python',
  'Flutter',
];

const {width} = Dimensions.get('window');

interface Skill {
  skill: string;
  proficiency: number;
}

interface Profile {
  name: string;
  email: string;
  contacts: string;
  experience: string;
  githubId: string;
  gender: string;
  skills: Skill[];
}

const MentorProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    contacts: '',
    experience: '',
    githubId: '',
    gender: '',
    skills: [],
  });

  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyModal, setProficiencyModal] = useState(false);

  // Update profile state
  const handleChange = (key: keyof Profile, value: string | Skill[]) => {
    setProfile({...profile, [key]: value});
  };
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Handle skill selection and open proficiency modal
  const handleSkillSelection = (skill: string) => {
    setSelectedSkill(skill);
    setProficiencyModal(true);
  };

  // Save skill with proficiency
  const handleProficiencySelection = (proficiency: number) => {
    if (selectedSkill) {
      setProfile(prev => ({
        ...prev,
        skills: [
          ...prev.skills.filter(item => item.skill !== selectedSkill), // Avoid duplicates
          {skill: selectedSkill, proficiency},
        ],
      }));
    }
    setProficiencyModal(false);
    setSelectedSkill(null);
    setSelectedValue(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name & Email */}
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={profile.name} editable={false} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={profile.email} editable={false} />

      {/* Contacts */}
      <Text style={styles.label}>Contacts</Text>
      <TextInput
        style={styles.input}
        value={profile.contacts}
        maxLength={10}
        keyboardType="numeric"
        placeholder="Enter Your Contact Number"
        onChangeText={text => handleChange('contacts', text)}
      />

      {/* Experience */}
      <Text style={styles.label}>Experience (Years)</Text>
      <TextInput
        style={styles.input}
        value={profile.experience}
        keyboardType="numeric"
        placeholder="Enter Your Experience"
        onChangeText={text => handleChange('experience', text)}
      />

      {/* Github ID */}
      <Text style={styles.label}>Github ID</Text>
      <TextInput
        style={styles.input}
        value={profile.githubId}
        onChangeText={text => handleChange('githubId', text)}
      />

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <RNPickerSelect
        onValueChange={value => handleChange('gender', value)}
        items={[
          {label: 'Male', value: 'Male'},
          {label: 'Female', value: 'Female'},
          {label: 'Other', value: 'Other'},
        ]}
        value={profile.gender}
      />

      {/* Skills Dropdown */}
      <Text style={styles.label}>Skills</Text>
      <DropDownPicker
        open={open}
        value={selectedValue} // Ensure this state exists
        items={skillsList.map(skill => ({label: skill, value: skill}))}
        setOpen={setOpen}
        setValue={setSelectedValue} // ✅ Add this prop
        onChangeValue={value => handleSkillSelection(value as string)} // Fix: Now updates state properly
        multiple={false} // If selecting only one value
        placeholder="Select skills"
        mode="BADGE"
        style={styles.dropdown}
      />

      {/* Display selected skills with proficiency */}
      {profile.skills.length > 0 && (
        <View style={styles.selectedSkillsContainer}>
          {profile.skills.map((item, index) => (
            <Text key={index} style={styles.selectedSkillText}>
              {item.skill} - Proficiency: {item.proficiency}
            </Text>
          ))}
        </View>
      )}

      {/* Proficiency Modal */}
      <Modal visible={proficiencyModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Select Proficiency for {selectedSkill}
            </Text>
            {[1, 2, 3].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.proficiencyButton}
                onPress={() => handleProficiencySelection(level)}>
                <Text style={styles.proficiencyText}>Level {level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ✅ Save Button */}
      <Button
        title="Save Changes"
        onPress={() => Alert.alert('Profile Updated Successfully!')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CAF0F8',
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  label: {
    width: '90%',
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 10,
  },
  dropdown: {
    width: '90%',
    marginBottom: 10,
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
    color: 'white',
    fontSize: 16,
  },
});

export default MentorProfile;
