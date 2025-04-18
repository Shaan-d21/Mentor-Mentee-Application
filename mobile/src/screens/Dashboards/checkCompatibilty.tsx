// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Button,
//   TextInput,
//   TouchableOpacity,
//   Modal
// } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// import { Mentor } from '../../redux/slices/sliceMenteeDashboard'; // Import the Mentor type
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faEnvelope, faBriefcase, faCode, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
// import { getDomainList, getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';
// import { fetchApprovedDomain } from '../../services/apiFetchApprovedDomain';

// const CheckCompatibility = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   // useEffect(()=>{

//   // },[]);

//   const data = [
//     { label: 'Database & Backend', value: 'Database & Backend' },
//     { label: 'Cloud Computing', value: 'Cloud Computing' },
//     { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
//     { label: 'Artificial Intelligence & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
//     { label: 'Data Science & Analytics', value: 'Data Science & Analytics' },
//     { label: 'Software Development', value: 'Software Development' },
//     { label: 'Project & Team Management', value: 'Project & Team Management' },
//     { label: 'Soft Skills', value: 'Soft Skills' },
//     { label: 'Web Development', value: 'Web Development' },
//   ];

//   const { domain_mentors, other_domain_mentors } = useSelector((state: RootState) => state.menteeDashboard);

//   const [value, setValue] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedReason, setSelectedReason] = useState('');
//   const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null); // Type selectedMentor

//   const userName = useSelector((state: RootState) => state.login.name);

//   const submitDomain = () => {
//   //The array of getDomain has to be removed
//   const {domain_mentors, other_domain_mentors, getDomain}= useSelector((state:RootState)=> state.menteeDashboard);

//   const [value, setValue] = useState('');

//   const userName = useSelector((state: RootState) => state.login.name);
//   const filteredData = getDomain=== null? []:data.filter(item => !getDomain.includes(item.value));

//   const submitDomain= ()=>{

//     dispatch(getMentorList(value));
//   };

//   const sendRequest = (id: number, domain: string) => {
//     dispatch(sendMentorRequest({ id, domain }));
//   };

//   const showReason = (mentor: Mentor) => { // Type mentor parameter
//     setSelectedMentor(mentor);
//     setSelectedReason(mentor.reason);
//     setModalVisible(true);
//   };
//   useEffect(()=>{
//     console.log('check comaptibility: Use Dispath');
//     const response= dispatch(getDomainList());
//     console.log("from the checCompatibility screen UI: ", response);
//   },[]);

//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={() => { }} openDrawer={() => { }} />

//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
//       </View>

//       {/* Dropdown button for selecting the domain. */}
//       <View style={styles.dropdownContainer}>
//         <Dropdown
//           style={styles.dropdown}
//           placeholderStyle={styles.placeholderStyle}
//           selectedTextStyle={styles.selectedTextStyle}
//           inputSearchStyle={styles.inputSearchStyle}
//           data={filteredData}
//           search
//           maxHeight={300}
//           labelField="label"
//           valueField="value"
//           placeholder="Select Domain"
//           searchPlaceholder="Search..."
//           value={value}
//           onChange={item => {
//             setValue(item.value);
//           }}
//         />
//       </View>

//       <Button
//         title="Submit"
//         onPress={submitDomain}
//       />

//       {/* List of the Mentors */}
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.sectionTitle}>Domain Mentors</Text>
//         {domain_mentors === null || domain_mentors.length === 0 ? (
//           <Text style={styles.noRequestsText}>No domain mentors found at this moment</Text>
//         ) : (
//           domain_mentors.map((mentor: Mentor) => ( // Type mentor variable
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <View style={styles.mentorInfo}>
//                 <Text style={styles.nameText}>{mentor.name}</Text>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.mail}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.designation}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faUserGraduate} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.domain}</Text>
//                 </View>
//               </View>
//               <View style={styles.scoreContainer}>
//                 <TouchableOpacity onPress={() => showReason(mentor)}>
//                   <Text style={styles.scoreText}>{mentor.score}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Button title="Request" onPress={() => { sendRequest(mentor.id, value) }} />
//             </View>
//           ))
//         )}

//         <Text style={styles.sectionTitle}>Other Domain Mentors</Text>
//         {other_domain_mentors === null || other_domain_mentors.length === 0 ? (
//           <Text style={styles.noRequestsText}>No other domain mentors found at this moment</Text>
//         ) : (
//           other_domain_mentors.map((mentor: Mentor) => ( // Type mentor variable
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <View style={styles.mentorInfo}>
//                 <Text style={styles.nameText}>{mentor.name}</Text>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.mail}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.designation}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faUserGraduate} size={16} color="#777" style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.domain}</Text>
//                 </View>
//               </View>
//               <View style={styles.scoreContainer}>
//                 <TouchableOpacity onPress={() => showReason(mentor)}>
//                   <Text style={styles.scoreText}>{mentor.score}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Button title="Request" onPress={() => { sendRequest(mentor.id, value) }} />
//             </View>
//           ))
//         )}
//       </ScrollView>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>{selectedReason}</Text>
//             <TouchableOpacity
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FAFAFA' },
//   header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
//   content: { flexGrow: 1, padding: 20 },
//   noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },

//   menteeRequest: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     backgroundColor: '#e0faf7', // Light blue background
//     borderWidth: 1, // Add border
//     borderColor: '#B2EBF2', // Light blue border
//   },

//   mentorInfo: {
//     flex: 1,
//   },

//   nameText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 3,
//   },
//   icon: {
//     marginRight: 8,
//     color: '#777',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#555',
//   },

//   scoreContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#B2EBF2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scoreText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2196F3',
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff'
//   },

//   buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },

//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2
//   },
//   buttonClose: {
//     backgroundColor: "#2196F3",
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   },
//   dropdownContainer: {
//     margin: 16,
//   },
//   dropdown: {
//     height: 50,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,

//     elevation: 2,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: 'gray'
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
// });

// export default CheckCompatibility;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Button,
//   TouchableOpacity,
//   Modal
// } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// import { Mentor } from '../../redux/slices/sliceMenteeDashboard';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faEnvelope, faBriefcase, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
// import { getDomainList, getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';

// const CheckCompatibility = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [value, setValue] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedReason, setSelectedReason] = useState('');
//   const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

//   const { domain_mentors, other_domain_mentors, getDomain } = useSelector((state: RootState) => state.menteeDashboard);
//   const userName = useSelector((state: RootState) => state.login.name);

//   const data = [
//     { label: 'Database & Backend', value: 'Database & Backend' },
//     { label: 'Cloud Computing', value: 'Cloud Computing' },
//     { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
//     { label: 'Artificial Intelligence & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
//     { label: 'Data Science & Analytics', value: 'Data Science & Analytics' },
//     { label: 'Software Development', value: 'Software Development' },
//     { label: 'Project & Team Management', value: 'Project & Team Management' },
//     { label: 'Soft Skills', value: 'Soft Skills' },
//     { label: 'Web Development', value: 'Web Development' },
//   ];

//   const filteredData = getDomain === null ? data : data.filter(item => !getDomain.includes(item.value));

//   const submitDomain = () => {
//     dispatch(getMentorList(value));
//   };

//   const sendRequest = (id: number, domain: string) => {
//     dispatch(sendMentorRequest({ id, domain }));
//   };

//   const showReason = (mentor: Mentor) => {
//     setSelectedMentor(mentor);
//     setSelectedReason(mentor.reason);
//     setModalVisible(true);
//   };

//   useEffect(() => {
//     dispatch(getDomainList());
//   }, []);

//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={() => { }} openDrawer={() => { }} />

//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
//       </View>

//       {/* Dropdown button for selecting the domain. */}
//       <View style={styles.dropdownContainer}>

//         <Dropdown
//   style={styles.dropdown}
//   placeholderStyle={styles.placeholderStyle}
//   selectedTextStyle={styles.selectedTextStyle}
//   inputSearchStyle={styles.inputSearchStyle} // <- optional, can also be removed
//   data={filteredData}
//   maxHeight={300}
//   labelField="label"
//   valueField="value"
//   placeholder="Select Domain"
//   value={value}
//   onChange={item => {
//     setValue(item.value);
//   }}
// />

//       </View>

//       <TouchableOpacity title="Find Mentors" onPress={submitDomain} />

//       {/* List of the Mentors */}
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.sectionTitle}>Domain Mentors</Text>
//         {domain_mentors?.length === 0 ? (
//           <Text style={styles.noRequestsText}>No domain mentors found at this moment</Text>
//         ) : (
//           domain_mentors?.map((mentor: Mentor) => (
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <View style={styles.mentorInfo}>
//                 <Text style={styles.nameText}>{mentor.name}</Text>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faEnvelope} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.mail}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faBriefcase} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.designation}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faUserGraduate} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.domain}</Text>
//                 </View>
//               </View>
//               <View style={styles.scoreContainer}>
//                 <TouchableOpacity onPress={() => showReason(mentor)}>
//                   <Text style={styles.scoreText}>{mentor.score}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Button title="Request" onPress={() => sendRequest(mentor.id, value)} />
//             </View>
//           ))
//         )}

//         <Text style={styles.sectionTitle}>Other Domain Mentors</Text>
//         {other_domain_mentors?.length === 0 ? (
//           <Text style={styles.noRequestsText}>No other domain mentors found at this moment</Text>
//         ) : (
//           other_domain_mentors?.map((mentor: Mentor) => (
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <View style={styles.mentorInfo}>
//                 <Text style={styles.nameText}>{mentor.name}</Text>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faEnvelope} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.mail}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faBriefcase} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.designation}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <FontAwesomeIcon icon={faUserGraduate} size={16} style={styles.icon} />
//                   <Text style={styles.infoText}>{mentor.domain}</Text>
//                 </View>
//               </View>
//               <View style={styles.scoreContainer}>
//                 <TouchableOpacity onPress={() => showReason(mentor)}>
//                   <Text style={styles.scoreText}>{mentor.score}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Button title="Request" onPress={() => sendRequest(mentor.id, value)} />
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Modal to show reason */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>{selectedReason}</Text>
//             <TouchableOpacity
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.textStyle}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FAFAFA' },
//   header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
//   content: { flexGrow: 1, padding: 20 },
//   noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },
//   menteeRequest: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     backgroundColor: '#e0faf7',
//     borderWidth: 1,
//     borderColor: '#B2EBF2',
//   },
//   mentorInfo: { flex: 1 },
//   nameText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
//   infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
//   icon: { marginRight: 8, color: '#777' },
//   infoText: { fontSize: 16, color: '#555' },
//   scoreContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#B2EBF2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scoreText: { fontSize: 16, fontWeight: 'bold', color: '#2196F3' },
//   dropdownContainer: { paddingHorizontal: 20, marginBottom: 10 },
//   dropdown: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff'
//   },
//   placeholderStyle: { fontSize: 16, color: '#999' },
//   selectedTextStyle: { fontSize: 16, color: '#333' },
//   inputSearchStyle: { height: 40, fontSize: 16 },
//   sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
//   centeredView: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 22 },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   modalText: { marginBottom: 15, textAlign: "center", fontSize: 16 },
//   button: { borderRadius: 8, padding: 10, elevation: 2 },
//   buttonClose: { backgroundColor: "#2196F3" },
//   textStyle: { color: "white", fontWeight: "bold", textAlign: "center" }
// });

// export default CheckCompatibility;

import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {Dropdown} from 'react-native-element-dropdown';
import {
  Mentor,
  resetRequestState,
} from '../../redux/slices/sliceMenteeDashboard';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faBriefcase,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDomainList,
  getMentorList,
  sendMentorRequest,
} from '../../redux/slices/sliceMenteeDashboard';
import {ScreenProps} from '../../navigation/types';

const CheckCompatibility: FC<ScreenProps<'CheckCompatibility'>> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);

  const {domain_mentors, other_domain_mentors, getDomain, requestMentorId} =
    useSelector((state: RootState) => state.menteeDashboard);
  const userName = useSelector((state: RootState) => state.login.name);

  const data = [
    {label: 'Database & Backend', value: 'Database & Backend'},
    {label: 'Cloud Computing', value: 'Cloud Computing'},
    {label: 'DevOps & Deployment', value: 'DevOps & Deployment'},
    {
      label: 'Artificial Intelligence & Machine Learning',
      value: 'Artificial Intelligence & Machine Learning',
    },
    {label: 'Data Science & Analytics', value: 'Data Science & Analytics'},
    {label: 'Software Development', value: 'Software Development'},
    {label: 'Project & Team Management', value: 'Project & Team Management'},
    {label: 'Soft Skills', value: 'Soft Skills'},
    {label: 'Web Development', value: 'Web Development'},
  ];

  const filteredData =
    getDomain === null
      ? data
      : data.filter(item => !getDomain.includes(item.value));

  // ...existing code...
  const submitDomain = async () => {
    // Make submitDomain async
    setLoading(true); // Set loading to true
    try {
      await dispatch(getMentorList(value)).unwrap();
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const sendRequest = async (id: number, domain: string) => {
    try {
      console.log('The request button is pressed by the mentor ', id);
      // Dispatch the action to send the mentor request
      const response = await dispatch(sendMentorRequest({id, domain})).unwrap();

      // Check if the response contains an error
      if (response.error) {
        throw new Error(response.error);
      }

      // Optionally, show a success message if needed
      Alert.alert('Success', 'Mentor request sent successfully!');
    } catch (error: any) {
      // Show an alert with the error message
      Alert.alert('Error', "Same mentor can't teach the 2 different courses");
    }
    // dispatch(sendMentorRequest({ id, domain }));
  };

  const showReason = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedReason(mentor.reason);
    setModalVisible(true);
  };

  useEffect(() => {
    dispatch(getDomainList());
    dispatch(resetRequestState());
  }, [dispatch, value]);
  useEffect(() => {
    console.log('Requested mentor id is ', requestMentorId);
  }, [requestMentorId]);

  return (
    <View style={styles.container}>
      <AppBar
        onProfilePress={() => {
          navigation.navigate('MenteeProfileScreen');
        }}
        openDrawer={() => {}}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{name: 'user', type: 'font-awesome'}} />
      </View>

      {/* Dropdown button for selecting the domain. */}
      <View style={styles.dropdownContainer}>
        <Dropdown
          disable={loading}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle} // <- optional, can also be removed
          data={filteredData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Domain"
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.findMentorsButton}
        onPress={submitDomain}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" /> // Show loading indicator
        ) : (
          <Text style={styles.findMentorsButtonText}>Find Mentors</Text> // Show text
        )}
      </TouchableOpacity>

      {/* List of the Mentors */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* {domain_mentors?.length === 0 && */}
        {/* <Text style={styles.sectionTitle}>Domain Mentors</Text>} */}

        {domain_mentors != null && (
          <Text style={styles.sectionTitle}>Domain Mentors</Text>
        )}

        {domain_mentors?.length === 0 ? (
          <Text style={styles.noRequestsText}>
            No domain mentors found at this moment
          </Text>
        ) : (
          domain_mentors?.map((mentor: Mentor) => (
            <View key={mentor.id} style={styles.menteeRequest}>
              <View style={styles.mentorInfo}>
                <Text
                  style={styles.nameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {mentor.name}
                </Text>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.infoText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {mentor.mail}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.infoText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {mentor.designation}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.domainText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {mentor.domain}
                  </Text>
                </View>
              </View>
              <View style={styles.bottomContent}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CheckReport', {
                      mentorId: mentor.id,
                      score: mentor.score,
                      domain: mentor.domain,
                    })
                  }>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{mentor.score}</Text>
                  </View>
                </TouchableOpacity>

                {requestMentorId === mentor.id ? (
                  <Text style={{color: 'blue', marginTop: 5}}>Pending</Text>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.requestButton,
                      requestMentorId !== null && {opacity: 0.5}, // Dim the button when disabled
                    ]}
                    onPress={() => sendRequest(mentor.id, value)}
                    disabled={requestMentorId !== null}>
                    <Text style={styles.requestButtonText}>
                      Request Mentorship
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        {other_domain_mentors != null && (
          <Text style={styles.sectionTitle}>Other Domain Mentors</Text>
        )}
        {other_domain_mentors?.length === 0 ? (
          <Text style={styles.noRequestsText}>
            No other domain mentors found at this moment
          </Text>
        ) : (
          other_domain_mentors?.map((mentor: Mentor) => (
            <View key={mentor.id} style={styles.menteeRequest}>
              <View style={styles.mentorInfo}>
                <Text
                  style={styles.nameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {mentor.name}
                </Text>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.infoText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {mentor.mail}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.infoText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {mentor.designation}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    size={16}
                    style={styles.icon}
                  />
                  <Text
                    style={styles.domainText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {mentor.domain}
                  </Text>
                </View>
              </View>
              <View style={styles.bottomContent}>
                <View style={styles.scoreContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CheckReport', {
                        mentorId: mentor.id,
                        score: mentor.score,
                        domain: mentor.domain,
                      })
                    }>
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreText}>{mentor.score}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {requestMentorId === mentor.id ? (
                  <Text style={{color: 'blue', marginTop: 5}}>Pending</Text>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.requestButton,
                      requestMentorId !== null && {opacity: 0.5}, // Dim the button when disabled
                    ]}
                    onPress={() => sendRequest(mentor.id, value)}
                    disabled={requestMentorId !== null}>
                    <Text style={styles.requestButtonText}>
                      Request Mentorship
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => sendRequest(mentor.id, value)}
                >
                  <Text style={styles.requestButtonText}>Request Mentorship</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal to show reason */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedReason}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FAFAFA'},
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {fontSize: 24, fontWeight: 'bold', color: '#333'},
  content: {flexGrow: 1, padding: 20},
  noRequestsText: {textAlign: 'center', color: '#888', fontSize: 16},
  menteeRequest: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#e0faf7',
    borderWidth: 1,
    borderColor: '#B2EBF2',
    minHeight: 200, // Increased minimum height
  },
  mentorInfo: {
    marginBottom: 10,
  },
  nameText: {fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5},
  infoRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 3},
  icon: {marginRight: 8, color: '#777'},
  infoText: {fontSize: 16, color: '#555'},
  domainText: {fontSize: 14, color: '#555'},

  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B2EBF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {fontSize: 16, fontWeight: 'bold', color: '#2196F3'},

  requestButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  dropdownContainer: {paddingHorizontal: 20, marginBottom: 10},
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: {fontSize: 16, color: '#999'},
  selectedTextStyle: {fontSize: 16, color: '#333'},
  inputSearchStyle: {height: 40, fontSize: 16},
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  findMentorsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
  },
  findMentorsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalText: {marginBottom: 15, textAlign: 'center', fontSize: 16},
  button: {borderRadius: 8, padding: 10, elevation: 2},
  buttonClose: {backgroundColor: '#2196F3'},
  textStyle: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
});

export default CheckCompatibility;
