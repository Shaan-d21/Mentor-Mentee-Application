import React, { use, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AppBar from '../../components/appbar_component';
import { Dropdown } from 'react-native-element-dropdown';
import DropdownComponent from '../../components/Dropdown';
import { apigetMenteeProfile } from '../../services/apimenteeprofile';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { MenteeProfile } from '../../types/MenteeProfileTypes';
import { getmenteeprofile } from '../../redux/slices/menteeProfileSlice';

const MenteeProfileScreen = () => {

  const currentStatus = useSelector((state: RootState) => state.menteeProfile.status);
  const userType: MenteeProfile | undefined = useSelector((state: RootState) => state.menteeProfile.response);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getmenteeprofile())
  }, [])
useEffect(() => {

// Assuming `response` is the API response object
const response = {
  "name": "mentee",
  "mail": "mentee@gmail.com",
  "role": "mentee",
  "exp": 0,
  "github_id": "fknfds",
  "contact": "9408188813",
  "gender": "male",
  "Skill set": [
    { "name": "string" },
    { "name": "string" },
    { "name": "string" },
    { "name": "py" }
  ]
};

// Parsing the "Skill set" into an array of skill names
const skillsArray = response["Skill set"].map(skill => skill.name);
console.log("skillsArray"); 
console.log(skillsArray); // Output: ["string", "string", "string", "py"]
},[])


  useEffect(() => {
    if (currentStatus === 'loading') {
      console.log('Loading user profile data...');
    }
    if (currentStatus === 'success') {
      console.log('User profile data:', userType);
      
      console.log('User profile data:', userType?.skillSet);
      if (userType) {

        setFullName(userType.name);
        setEmail(userType.mail);
        setMobile(userType.contact);
        setGenderLocal(userType.gender);
        setGithubId(userType.github_id);
      }


    } else if (currentStatus === 'failed') {
      console.log('Failed to fetch user profile data');
    }

  }, [currentStatus]);

  const [_imageUri, setImageUri] = useState('https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [genderLocal, setGenderLocal] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [githubId, setGithubId] = useState('');

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else if (response.assets) {
          const selectedImage = response.assets[0]?.uri || '';
          setImageUri(selectedImage); // Set the selected image URI
        }
      }
    );
  };

  // Email validation function
  const validateEmail = (_inputEmail: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Mobile validation function
  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = () => {
    let isValid = true;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate mobile number
    if (!validateMobile(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    if (isValid) {
      // Submit the form or proceed further
      console.log('Form is valid');
    }
  };

  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  function handleDomainSelection(value: string): void {
    setSelectedDomain(value);
    console.log('Selected domain:', value);
  }
  return (



    currentStatus === 'loading' ? (
      <View style={styles.container}>
        <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 16,
        }}>
          Loading Profile...
        </Text>
      </View>
    ) :
    currentStatus === 'failed' ? (
      <View style={styles.container}>
        <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 16,
        }}>
          Failed to load Profile.
        </Text>
      </View>
    ) :
    
    (
      <ScrollView contentContainerStyle={styles.container}>
        <AppBar onProfilePress={() => { }} openDrawer={() => { }} />
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: _imageUri }}
            />
          </View>
          <View style={styles.infoContainer}>
            <TextInput
              style={styles.infoText}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
            />
            <TextInput
              style={[styles.infoText, emailError && styles.inputError]}
              value={email}
              onChangeText={setEmail} placeholder="Email"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
              style={[styles.infoText, mobileError && styles.inputError]}
              value={mobile}
              onChangeText={setMobile} // Update the mobile number dynamically
              placeholder="Mobile Number"
              keyboardType="phone-pad"
            />
            {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
            <TextInput
              style={styles.infoText}
              value={githubId}
              onChangeText={setGithubId} placeholder="GitHub ID"
            />

            <View style={styles.genderPickerContainer}>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={genderLocal}
                onChange={(item) => setGenderLocal(item.value)}
              />
            </View>
          </View>
        </View>

        <View style={styles.domainsContainer}>
          <Text style={styles.domainsTitle}>Skills</Text>
          <View style={styles.domainsList}>
            {userType?.skillSet.map((skill:any, index:any) => (
              <View key={index} style={styles.domainItem}>
                <Text style={styles.domainText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.dropdownContainer}>
          <DropdownComponent
            data={[
              { label: 'Python', value: 'python' },
              { label: 'JavaScript', value: 'javascript' },
              { label: 'React', value: 'react' },
              { label: 'Node.js', value: 'nodejs' },
            ]}
            selectedValue={selectedDomain || ''}
            onSelect={handleDomainSelection}
            placeholder="Select Skills"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  // domainsTitle: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  // },
  addDomainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addDomainInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#3498db', // Change to your theme color
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
