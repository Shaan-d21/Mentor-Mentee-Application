// //// filepath: c:\Users\Kavan\Desktop\Mentor-Mentee-Application\mobile\src\screens\profile\mentorprofile.tsx
// import React, { FC, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Button,
//   Alert,
//   TouchableOpacity,
//   Modal,
//   Image,
// } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import DropdownComponent from '../../components/Dropdown';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { getmentorprofile, updateMentorProfileData, updateMentorprofileskill } from '../../redux/slices/mentorProfileSlice';
// import { MentorProfiletype, Skill } from '../../types/MentorProfileTypes';
// import AppBar from '../../components/appbar_component';
// import { ScreenProps } from '../../navigation/types';

// interface LocalMentorProfile {
//   name: string;
//   mail: string;
//   role: string;
//   exp: string;         // we'll convert numeric exp from server to string locally
//   github_id: string;
//   contact: string;
//   gender: string;
//   skillSet: Skill[];
// }

// const MentorProfile: FC<ScreenProps<"MentorProfileScreen">>= ({navigation})=> {
//   const dispatch = useDispatch<AppDispatch>();
//   const currentStatus = useSelector((state: RootState) => state.mentorProfile.status);
//   const mentorData = useSelector((state: RootState) => state.mentorProfile.response);

//   const [profile, setProfile] = useState<LocalMentorProfile>({
//     name: '',
//     mail: '',
//     role: 'mentor',
//     exp: '0',
//     github_id: '',
//     contact: '',
//     gender: 'male',
//     skillSet: [],
//   });

//   const [imageUri, setImageUri] = useState(
//     'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format'
//   );
//   const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
//   const [proficiencyModal, setProficiencyModal] = useState(false);

//   useEffect(() => {
//     dispatch(getmentorprofile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (currentStatus === 'loading') {
//       console.log('Loading mentor profile data...');
//     } else if (currentStatus === 'success' && mentorData) {
//       // Convert numeric exp to a string for the text input
//       // and set default images by gender
//       const newExp = mentorData.exp !== null ? mentorData.exp.toString() : '0';
//       setProfile({
//         name: mentorData.name || '',
//         mail: mentorData.mail || '',
//         role: mentorData.role || 'mentor',
//         exp: newExp,
//         github_id: mentorData.github_id || '',
//         contact: mentorData.contact || '',
//         gender: mentorData.gender || '',
//         skillSet: mentorData.skillSet || [],
//       });

//       // if (mentorData.gender === 'female') {
//       //   setImageUri('https://cdn-icons-png.flaticon.com/512/146/146005.png');
//       // } else if (mentorData.gender === 'male') {
//       //   setImageUri('https://cdn-icons-png.flaticon.com/512/146/146007.png');
//       // } else {
//       //   setImageUri('https://cdn-icons-png.flaticon.com/512/149/149071.png');
//       // }
//     } else if (currentStatus === 'failed') {
//       console.log('Failed to fetch mentor profile data');
//     }
//   }, [currentStatus, mentorData]);

//   function handleChange<K extends keyof LocalMentorProfile>(key: K, value: LocalMentorProfile[K]) {
//     setProfile(prev => ({ ...prev, [key]: value }));
//   }

//   // Handle skill selection
//   function handleSkillSelection(skill: string) {
//     setSelectedSkill(skill);
//     setProficiencyModal(true);
//   }

//   // Save skill with chosen proficiency
//   function handleProficiencySelection(proficiency: number) {
//     if (selectedSkill) {
//       dispatch(updateMentorprofileskill({ skill: selectedSkill, level: proficiency.toString() }));
//     }
//     setProficiencyModal(false);
//     setSelectedSkill(null);
//   }

//   // save method
//   function handleSaveChanges() {


//     dispatch(updateMentorProfileData({contact: profile.contact,
//       exp:profile.exp,
//       gender:profile.gender,github_id:profile.github_id,name:profile.name}));
//   }

//   return (
//     currentStatus === 'loading' ? (
//         <View style={styles.container}>
//           <Text style={styles.loadingText}>Loading Profile...</Text>
//         </View>
//       ) : currentStatus === 'failed' ? (
//         <View style={styles.container}>
//           <Text style={styles.loadingText}>Failed to load Profile.</Text>
//         </View>
//       ) : (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* <AppBar onProfilePress={() => { }} openDrawer={() => { }} /> */}
//       <TouchableOpacity style={styles.appbar} onPress={() => { }} />
//       <View style={styles.profileImageContainer}>
//         <Image style={styles.profileImage} source={{ uri: imageUri }} />
//       </View>

//       <Text style={styles.label}>Name</Text>
//       <TextInput
//         style={styles.input}
//         value={profile.name}
//         onChangeText={txt => handleChange('name', txt)}
//         placeholder="Enter your name"
//       />

//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         value={profile.mail}
//         onChangeText={txt => handleChange('mail', txt)}
//         placeholder="Enter your email"
//       />

//       <Text style={styles.label}>Contact</Text>
//       <TextInput
//         style={styles.input}
//         value={profile.contact}
//         keyboardType="numeric"
//         onChangeText={txt => handleChange('contact', txt)}
//         placeholder="Enter your contact number"
//       />

//       <Text style={styles.label}>Experience (Years)</Text>
//       <TextInput
//         style={styles.input}
//         value={profile.exp}
//         keyboardType="numeric"
//         onChangeText={txt => handleChange('exp', txt)}
//         placeholder="Enter your experience in years"
//       />

//       <Text style={styles.label}>Github ID</Text>
//       <TextInput
//         style={styles.input}
//         value={profile.github_id}
//         onChangeText={txt => handleChange('github_id', txt)}
//         placeholder="Enter your GitHub username"
//       />

//       {/* <Text style={styles.label}>Gender</Text>
//       <DropdownComponent
//         // onValueChange={value => handleChange('gender', (value as string) || '')}
//         data={[
//           { label: 'Male', value: 'male' },
//           { label: 'Female', value: 'female' },
//           // { label: 'Other', value: 'other' },
//         ]}
//         selectedValue={profile.gender}
//         onSelect= { (value)=> handleChange('gender', (value as string) || '')}
//       /> */}

//       <Text style={styles.label}>Add a Skill</Text>
//       <DropdownComponent
//         data={[
//           { label: 'JavaScript', value: 'JavaScript' },
//           { label: 'Python', value: 'Python' },
//           { label: 'Java', value: 'Java' },
//           { label: 'C++', value: 'C++' },
//           { label: 'React', value: 'React' },
//           { label: 'Node.js', value: 'Node.js' },
//           { label: 'SQL', value: 'SQL' },
//           { label: 'Machine Learning', value: 'Machine Learning' },
//           { label: 'Data Science', value: 'Data Science' },
//           { label: 'Cybersecurity', value: 'Cybersecurity' },
//         ]}
//         selectedValue=""
//         onSelect={handleSkillSelection}
//         placeholder="Select a skill"
//       />

//        {/* {profile.skillSet.length > 0 && (
//         <View style={styles.selectedSkillsContainer}>
//           {[... new Set(profile.skillSet)].map((item, index) => (
//             <Text key={index} style={styles.selectedSkillText}>
//               console.log(`item is ${JSON.stringify(item)}`);
//               {item.name} — Level: {item.proficiency}
//             </Text>
//           ))}
//         </View>
//       )}  */}
// {profile.skillSet.length > 0 && (
//   <View style={styles.selectedSkillsContainer}>
//     {Array.from(
//       new Map(profile.skillSet.map((item) => [item.name, item])).values()
//     ).map((item, index) => (
//       <Text key={index} style={styles.selectedSkillText}>
//         {item.name} — Level: {item.proficiency}
//       </Text>
//     ))}
//   </View>
// )}

//       <Modal visible={proficiencyModal} transparent animationType="slide">
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Select proficiency for {selectedSkill}</Text>
//             {[1, 2, 3].map(level => (
//               <TouchableOpacity
//                 key={level}
//                 style={styles.proficiencyButton}
//                 onPress={() => handleProficiencySelection(level)}
//               >
//                 <Text style={styles.proficiencyText}>Level {level}</Text>
//               </TouchableOpacity>

//             ))}
//           </View>
//         </View>
//       </Modal>

//       <View style={{ marginTop: 20 }}>
//         <Button title="Save Changes" onPress={handleSaveChanges} />
//       </View>

//       <TouchableOpacity
//               // style={styles.button}
//               onPress={() => {
//                 navigation.navigate('MentorDashboard');
                
//               }}  
//             >
//               <Text 
//                 // style={styles.buttonText}
//               >
//                 Go Back
//               </Text>
//             </TouchableOpacity>
//     </ScrollView>
//   ));
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow:1,
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   appbar:{
// width: '100%'
//   },
//   label: {
//     width: '90%',
//     textAlign: 'left',
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
  
//   loadingText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     width: '90%',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   profileImageContainer: {
//     marginRight: 16,
//     alignItems: 'center',
//     position: 'relative',
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 170,
//     height: 200,
//     marginTop: 16,
//     overflow: 'hidden',
//   },
//   selectedSkillsContainer: {
//     width: '90%',
//     marginTop: 10,
//   },
//   selectedSkillText: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#333',
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: 300,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   proficiencyButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     marginVertical: 5,
//     width: 200,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   proficiencyText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default MentorProfile;


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

interface LocalMentorProfile {
  name: string;
  mail: string;
  role: string;
  exp: string; // we'll convert numeric exp from server to string locally
  github_id: string;
  contact: string;
  gender: string;
  skillSet: Skill[];
}

const MentorProfile: FC<ScreenProps<'MentorProfileScreen'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStatus = useSelector(
    (state: RootState) => state.mentorProfile.status,
  );
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

  const [_imageUri] = useState(
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format',
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyModal, setProficiencyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

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
        role: mentorData.role || 'mentor',
        exp: newExp,
        github_id: mentorData.github_id || '',
        contact: mentorData.contact || '',
        gender: mentorData.gender || '',
        skillSet: mentorData.skillSet || [],
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

    if (!validateEmail()) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validateMobile(profile.contact)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    if (isValid) {
      setIsEditing(false);
      dispatch(
        updateMentorProfileData({
          contact: profile.contact,
          exp: profile.exp,
          gender: profile.gender,
          github_id: profile.github_id,
          name: profile.name,
        }),
      );
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
              <Text style={styles.profileText}>GitHub ID: {profile.github_id}</Text>
              <Text style={styles.profileText}>Gender: {profile.gender}</Text>
            </>
          ) : (
            <>
              <Text>Full Name</Text>
              <TextInput
                style={styles.infoText}
                value={profile.name}
                onChangeText={txt => handleChange('name', txt)}
                placeholder="Full Name"
              />
              <Text>Email</Text>
              <TextInput
                style={[styles.infoText, emailError && styles.inputError]}
                value={profile.mail}
                onChangeText={txt => handleChange('mail', txt)}
                placeholder="Email"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              <Text>Mobile</Text>
              <TextInput
                style={[styles.infoText, mobileError && styles.inputError]}
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
              <Text>GitHub ID</Text>
              <TextInput
                style={styles.infoText}
                value={profile.github_id}
                onChangeText={txt => handleChange('github_id', txt)}
                placeholder="GitHub ID"
              />
              {/* <View style={styles.genderPickerContainer}>
                <DropdownComponent
                  data={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ]}
                  selectedValue={profile.gender}
                  onSelect={(value) => handleChange('gender', (value as string) || '')}
                  placeholder="Select Gender"
                />
              </View> */}
            </>
          )}
        </View>
      </View>

      {!!profile.skillSet?.length && (
        <View style={styles.domainsContainer}>
          <Text style={styles.domainsTitle}>Skills</Text>
          {/* <View style={styles.domainsList}>
            {Array.from(
              new Map(profile.skillSet.map(item => [item.name, item])),
            ).map((item, index) => (
              <View key={index} style={styles.domainItem}>
                <Text style={styles.domainText}>
                  {item.name} - Level: {item.proficiency}
                </Text>
              </View>
            ))}
            </View> */}
            <View style={styles.domainsList}>
     {Array.from(
       new Map(profile.skillSet.map((item) => [item.name, item])).values()
     ).map((item, index) => (
       <Text key={index} style={styles.domainItem}>
         {item.name} — Level: {item.proficiency}
       </Text>
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
        }}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Profile' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('MentorDashboard');
        }}>
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
                onPress={() => handleProficiencySelection(level)}>
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