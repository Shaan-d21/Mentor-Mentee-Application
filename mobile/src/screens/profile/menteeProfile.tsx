import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { MenteeProfile, Skill } from "../../types/MenteeProfileTypes";
import {
  getmenteeprofile,
  updateProfileData,
  updateprofileskill,
  deleteProfileSkill
} from "../../redux/slices/profileSlice/menteeProfileSlice";
import { ScreenProps } from "../../navigation/types";
import { setName, changeProfileStatus } from "../../redux/slices/auth/sliceLogin";
import { MMKV } from "react-native-mmkv";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faBriefcase,
  faUser,
  faPhone,
  faCode,
  faEdit,
  faSave,
  faUserCircle,
  faPlusCircle,
  faTimes,
  faCheckCircle,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import AppBar from "../../components/appbar_component";
import { profileStyles, mentorSpecificStyles } from "./profileStyle";

const allSkillsList = [
  "Python",
  "Java",
  "JavaScript",
  "C++",
  "SQL",
  "Node JS",
  "SpringBoot",
  "AWS",
  "GCP",
  "Docker",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "TensorFlow",
  "LangChain",
  "GenAI",
  "Data Analysis",
  "Big Data",
  "Data Structure",
  "Problem Solving",
  "Project Management",
  "Leadership",
  "Time Management",
  "Communication",
  "Public Speaking",
  "Critical Thinking",
  "Teamwork",
  "HTML",
  "CSS",
];

const MenteeProfileScreen: FC<ScreenProps<"MenteeProfileScreen">> = ({
  navigation,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [designationError, setDesignationError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // States for skills
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<{ [key: string]: number }>({});
  const [expandedSkills, setExpandedSkills] = useState<{ [key: string]: boolean }>({});

  const profile_status = useSelector((state: RootState) => state.login.profile_status);

  const currentStatus = useSelector((state: RootState) => state.menteeProfile.status);
  const menteeProfileStatus = useSelector(
    (state: RootState) => state.menteeProfile.Menteeprofile_status
  );
  const userType: MenteeProfile | undefined = useSelector(
    (state: RootState) => state.menteeProfile.response
  );
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const storage = new MMKV();

  useEffect(() => {
    dispatch(getmenteeprofile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(changeProfileStatus(!!menteeProfileStatus));
  }, [menteeProfileStatus, dispatch]);

  useEffect(() => {
    if (currentStatus === "loading") {
      console.log("Loading user profile data...");
    }
    if (currentStatus === "success") {
      if (userType) {
        setFullName(userType.name);
        setEmail(userType.mail);
        setMobile(userType.contact);
        setDesignation(userType.designation);

        // Convert skills to skillMap format
        const skillMap: { [key: string]: number } = {};
        userType.skillSet.forEach(skill => {
          skillMap[skill.name] = skill.proficiency;
        });
        setSelectedSkills(skillMap);
      }
    } else if (currentStatus === "failed") {
      console.log("Failed to fetch user profile data");
    }
  }, [currentStatus, userType]);

  useEffect(() => {
    if (currentStatus === "failed") {
      Alert.alert("Error", "Failed to load Profile.", [
        {
          text: "Retry",
          onPress: () => dispatch(getmenteeprofile()),
        },
        {
          text: "Cancel",
          onPress: () => navigation.pop(),
          style: "cancel",
        },
      ]);
    }
  }, [currentStatus, dispatch, navigation]);

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
    const cleanedName = fullName.trim().replace(/\s+/g, ' ');

    if (!cleanedName) {
      setNameError('Name cannot be empty.');
      isValid = false;
    }
    else if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(cleanedName)) {
      setNameError('Name must contain only letters with single spaces between words.');
      isValid = false;
    }
    else {
      setNameError('');
    }

    if (!mobile.trim()) {
      setMobileError('Mobile number cannot be empty.');
      isValid = false;
    }
    else if (!/^[1-9][0-9]{9}$/.test(mobile.trim())) {
      setMobileError('Please enter a valid number.');
      isValid = false;
    }
    else if (/^(\d)\1{9}$/.test(mobile.trim())) {
      setMobileError('Please enter a valid number.');
      isValid = false;
    }
    else {
      setMobileError('');
    }



    if (!designation || !designation.trim()) {
      setDesignationError('Designation cannot be empty.');
      isValid = false;
    }
    else if (!/^[A-Za-z][A-Za-z0-9\s\W]*$/.test(designation.trim())) {
      setDesignationError('Designation must start with a letter.');
      isValid = false;
    }
    else {
      setDesignationError('');
    }


    // Validate email
    if (!email || !email.trim()) {
      setEmailError("Email cannot be empty.");
      isValid = false;
    } else if (!validateEmail()) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate phone
    if (!mobile || !mobile.trim()) {
      setMobileError("Mobile number cannot be empty.");
      isValid = false;
    } else if (!validateMobile(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      isValid = false;
    } else {
      setMobileError("");
    }

    // Validate designation
    if (!designation || !designation.trim()) {
      setDesignationError("Designation cannot be empty.");
      isValid = false;
    } else {
      setDesignationError("");
    }

    if (isValid) {
      setIsEditing(false);
      dispatch(
        updateProfileData({
          name: fullName,
          contact: mobile,
          designation: designation,
        })
      );
      dispatch(setName(fullName));
    }
    setIsEditing(false);

  };

  // Open the skill selection modal
  const openSkillModal = () => {
    // Save current skills to temporary state for editing
    setModalVisible(true);
  };

  // Close the skill selection modal
  const cancelSkillModal = () => {
    setModalVisible(false);
  };

  // Save selected skills
  const saveSkills = () => {
    setModalLoading(true);

    // Convert the selectedSkills object to array format
    const skillArray: Skill[] = Object.entries(selectedSkills).map(([name, proficiency], index) => ({
      id: index,
      skill_id: index,
      name,
      proficiency,
    }));

    dispatch(updateprofileskill(skillArray)).then(() => {
      setModalLoading(false);
      setModalVisible(false);
    });
  };

  // Toggle skill selection with proficiency level
  const handleSkillLevel = (skillName: string, level: number) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillName]: level
    }));


    // Collapse the expanded skill
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: false
    }));
  };

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await dispatch(deleteProfileSkill(skillId)).unwrap();
      dispatch(getmenteeprofile());
    } catch (error) {
      Alert.alert("Error", "Failed to delete skill. Please try again.");
    }
  };

  return currentStatus === "loading" ? (
    <View style={[profileStyles.container, { justifyContent: "center", alignItems: "center" }]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={profileStyles.container}>
        {userType?.skillSet?.length !== 0 && profile_status && (
          <AppBar
            onProfilePress={() => navigation.navigate("MenteeProfileScreen")}
            title="Mentee Profile"
            openDrawer={() => { }}
          />
        )}
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
                    style={[profileStyles.inputField, nameError ? profileStyles.inputError : undefined]}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full Name"
                  />
                </View>
                {nameError ? <Text style={profileStyles.errorText}>{nameError}</Text> : null}

                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} size={18} color="#3498db" style={profileStyles.inputIcon} />
                  <Text style={[profileStyles.inputField, profileStyles.disabledInput]}>{email}</Text>
                </View>
                {emailError ? <Text style={profileStyles.errorText}>{emailError}</Text> : null}

                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon icon={faPhone} size={18} color="#3498db" style={profileStyles.inputIcon} />
                  <TextInput
                    style={[profileStyles.inputField, mobileError ? profileStyles.inputError : undefined]}
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={10}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                  />
                </View>
                {mobileError ? <Text style={profileStyles.errorText}>{mobileError}</Text> : null}

                <View style={profileStyles.inputContainer}>
                  <FontAwesomeIcon icon={faBriefcase} size={18} color="#3498db" style={profileStyles.inputIcon} />
                  <TextInput
                    style={[profileStyles.inputField, designationError ? profileStyles.inputError : undefined]}
                    value={designation}
                    onChangeText={setDesignation}
                    placeholder="Designation"
                  />
                </View>
                {designationError ? <Text style={profileStyles.errorText}>{designationError}</Text> : null}
              </>
            )}
          </View>
        </View>

        {userType?.skillSet?.length === 0 ? (
          <View style={profileStyles.emptySkillsContainer}>
            <Text style={profileStyles.emptySkillsText}>
              Please add at least one skill.
            </Text>

          </View>
        ) : (

          //{userType?.skillSet?.length && (
          <View style={profileStyles.domainsContainer}>
            <View style={profileStyles.sectionHeaderRow}>
              <FontAwesomeIcon icon={faCode} size={18} color="#3498db" />
              <Text style={profileStyles.domainsTitle}>Skills</Text>

            </View>
            <View style={profileStyles.domainsList}>
              {userType?.skillSet?.map((skill: Skill, index: number) => (
                //<View key={index} style={profileStyles.skillItem}>
                <View key={skill.skill_id} style={profileStyles.skillItem}>

                  <Text style={profileStyles.skillText}>{skill.name}</Text>
                  <View style={mentorSpecificStyles.skillLevel}>
                    <Text style={mentorSpecificStyles.levelText}>
                      Level {skill.proficiency}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteSkill(skill.skill_id)}>

                    <FontAwesomeIcon
                      icon={faXmark}
                      size={16}
                      color="#3498db"
                      style={profileStyles.icon}
                    />

                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Button to add/edit skills */}
        {!isEditing && (
          <TouchableOpacity
            style={[profileStyles.button, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={openSkillModal}>
            <FontAwesomeIcon icon={faPlusCircle} size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={profileStyles.buttonText}>Add / Edit Skills</Text>
          </TouchableOpacity>
        )}

        {/* Button to update profile or save changes */}
        {!isEditing ? (
          <TouchableOpacity style={profileStyles.button} onPress={handleEditToggle}>
            <FontAwesomeIcon icon={faEdit} size={16} color="#fff" style={profileStyles.buttonIcon} />
            <Text style={profileStyles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={profileStyles.button} onPress={handleSubmit}>
            <FontAwesomeIcon icon={faSave} size={16} color="#fff" style={profileStyles.buttonIcon} />
            <Text style={profileStyles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        )}

        {/* Modal for skill selection with proficiency levels - match mentor UI */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelSkillModal}>
          <View style={mentorSpecificStyles.modalBackground}>
            <View style={mentorSpecificStyles.modalContainer}>
              <Text style={mentorSpecificStyles.modalTitle}>
                Add / Edit Skills
              </Text>

              <ScrollView style={{ maxHeight: 400, width: '100%' }}>
                {allSkillsList.map((skillName: string) => {
                  const currentLevel = selectedSkills[skillName] || 0;
                  const isExpanded = expandedSkills[skillName] || false;

                  return (
                    <View key={skillName} style={mentorSpecificStyles.expandableSkillItem}>
                      <TouchableOpacity
                        style={mentorSpecificStyles.expandableSkillHeader}
                        onPress={() => {
                          if (!isExpanded) {
                            setExpandedSkills(prev => ({ ...prev, [skillName]: true }));
                          }
                        }}
                        disabled={isExpanded}
                      >
                        <Text style={mentorSpecificStyles.skillLabel}>{skillName}</Text>
                        {currentLevel > 0 && (
                          <View style={mentorSpecificStyles.selectedLevelBadge}>
                            <Text style={mentorSpecificStyles.selectedLevelText}>
                              Level {currentLevel}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={mentorSpecificStyles.levelButtonRow}>
                          {[1, 2, 3].map((level: number) => (
                            <TouchableOpacity
                              key={level}
                              style={[
                                mentorSpecificStyles.levelButton,
                                currentLevel === level && mentorSpecificStyles.levelButtonSelected,
                              ]}
                              onPress={() => {
                                handleSkillLevel(skillName, level);
                              }}
                            >
                              <Text style={[
                                mentorSpecificStyles.levelButtonText,
                                currentLevel === level && mentorSpecificStyles.levelButtonTextSelected,
                              ]}>
                                Level {level}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                {!modalLoading ? (
                  <TouchableOpacity
                    style={[profileStyles.button, { marginRight: 10, backgroundColor: '#7f8c8d' }]}
                    onPress={cancelSkillModal}>
                    <FontAwesomeIcon
                      icon={faTimes}
                      size={16}
                      color="#fff"
                      style={profileStyles.buttonIcon}
                    />
                    <Text style={profileStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[profileStyles.button, { marginLeft: 10 }]}
                  onPress={saveSkills}>
                  {modalLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MenteeProfileScreen;