// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';

// const CheckCompatibility = () => {  
//   const dispatch = useDispatch<AppDispatch>();

//   const data=[
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
//   // const {mentorList, requestMentorId}= useSelector((state:RootState)=> state.menteeDashboard)
//   const {domain_mentors, other_domain_mentors}= useSelector((state:RootState)=> state.menteeDashboard);

//   const [value, setValue] = useState('');
//   // useEffect(()=>{console.log(`value is ${JSON.stringify(value)}`)}, [value]);

// const userName = useSelector((state: RootState) => state.login.name);

  
//   const submitDomain= ()=>{
//     dispatch(getMentorList(value));
//     // console.log(`Users are : ${JSON.stringify(mentorList)}`);
//   }
//   const sendRequest= (id:number, domain:string)=>{
//     // console.log(`id is ${id} and domain is ${domain}`);
//     dispatch(sendMentorRequest({id, domain}));
//     console.log("send request");
//   }


//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={() => {}} openDrawer={() => {}} />
      
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
//       </View>

//       {/*Dropdown button for selecting the domain.*/}
//       <Dropdown 
//         data={data} 
//         labelField={"label"}
//         valueField="value"
//         value={value}
//         placeholder="Select Domain"
//         onChange= {(item)=>{setValue(item.value)}}
//       />

//       <Button 
//         title="Submit"
//         onPress= {submitDomain}
//       />

//       {/* List of the Mentors */}
//       <ScrollView contentContainerStyle={styles.content}>
//         /* If there are not mentors then */
//         {other_domain_mentors=== null || other_domain_mentors.length === 0 ? (
//           <Text style={styles.noRequestsText}>No mentors found at this moment</Text>
//         ) : 
//         /* List all the mentors */
//         (
//           other_domain_mentors.map(mentor => (
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <Text style={styles.text}>Connect with {mentor.name}</Text>
//               {/* {
//                 requestMentorId=== mentor.id ?(
//                   <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
//                 ) : (
//                   <Button
//                 title="Request"
//                 onPress={() => sendRequest(mentor.id, value)}
//                 disabled={requestMentorId !== null} // Disable all other buttons
//               />
//                 )
//               } */}
//               {/* <Button title="Request" onPress= {()=>{sendRequest(mentor.id, mentor.domain)}}/> */}
//             </View>
//           ))
//         )}
//       </ScrollView>
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
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15, 
//     padding: 15, 
//     borderRadius: 10, 
//     elevation: 3, 
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     backgroundColor: '#FFF9C4',
//   },

//   text: { fontSize: 18, fontWeight: '600' },

//   input: { 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     borderRadius: 8, 
//     padding: 10, 
//     marginVertical: 5, 
//     backgroundColor: '#fff' 
//   },

//   buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

//   acceptedTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
//   acceptedMentee: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#333', 
//     padding: 12, 
//     marginVertical: 5, 
//     borderRadius: 8, 
//     borderWidth: 2, 
//     borderColor: '#4CAF50', 
//     backgroundColor: '#E8F5E9',
//     textAlign: 'center' 
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
//   TextInput,
//   TouchableOpacity,
//   Modal
// } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';
// import { Mentor } from '../../redux/slices/sliceMenteeDashboard'; // Import the Mentor type

// const CheckCompatibility = () => {
//   const dispatch = useDispatch<AppDispatch>();

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

//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={() => { }} openDrawer={() => { }} />

//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
//       </View>

//       {/* Dropdown button for selecting the domain. */}
//       <Dropdown
//         data={data}
//         labelField={"label"}
//         valueField="value"
//         value={value}
//         placeholder="Select Domain"
//         onChange={(item) => { setValue(item.value) }}
//       />

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
//               <Text style={styles.text}>Name: {mentor.name}</Text>
//               <Text style={styles.text}>Domain: {mentor.domain}</Text>
//               <Text style={styles.text}>Email: {mentor.mail}</Text>
//               <Text style={styles.text}>Designation: {mentor.designation}</Text>
//               <TouchableOpacity onPress={() => showReason(mentor)}>
//                 <Text style={styles.scoreText}>Score: {mentor.score}</Text>
//               </TouchableOpacity>
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
//               <Text style={styles.text}>Name: {mentor.name}</Text>
//               <Text style={styles.text}>Domain: {mentor.domain}</Text>
//               <Text style={styles.text}>Email: {mentor.mail}</Text>
//               <Text style={styles.text}>Designation: {mentor.designation}</Text>
//               <TouchableOpacity onPress={() => showReason(mentor)}>
//                 <Text style={styles.scoreText}>Score: {mentor.score}</Text>
//               </TouchableOpacity>
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
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FAFAFA' },
//   header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
//   content: { flexGrow: 1, padding: 20 },
//   noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },

//   menteeRequest: {
//     marginBottom: 15,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     backgroundColor: '#FFF9C4',
//   },

//   text: { fontSize: 18, fontWeight: '600' },
//   scoreText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//     cursor: 'pointer'
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
//   }
// });

// export default CheckCompatibility;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Dropdown } from 'react-native-element-dropdown';
import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';
import { Mentor } from '../../redux/slices/sliceMenteeDashboard'; // Import the Mentor type
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBriefcase, faCode, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

const CheckCompatibility = () => {
  const dispatch = useDispatch<AppDispatch>();

  const data = [
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

  const { domain_mentors, other_domain_mentors } = useSelector((state: RootState) => state.menteeDashboard);

  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null); // Type selectedMentor

  const userName = useSelector((state: RootState) => state.login.name);

  const submitDomain = () => {
    dispatch(getMentorList(value));
  };

  const sendRequest = (id: number, domain: string) => {
    dispatch(sendMentorRequest({ id, domain }));
  };

  const showReason = (mentor: Mentor) => { // Type mentor parameter
    setSelectedMentor(mentor);
    setSelectedReason(mentor.reason);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => { }} openDrawer={() => { }} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      {/* Dropdown button for selecting the domain. */}
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Domain"
          searchPlaceholder="Search..."
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
        />
      </View>

      <Button
        title="Submit"
        onPress={submitDomain}
      />

      {/* List of the Mentors */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Domain Mentors</Text>
        {domain_mentors === null || domain_mentors.length === 0 ? (
          <Text style={styles.noRequestsText}>No domain mentors found at this moment</Text>
        ) : (
          domain_mentors.map((mentor: Mentor) => ( // Type mentor variable
            <View key={mentor.id} style={styles.menteeRequest}>
              <View style={styles.mentorInfo}>
                <Text style={styles.nameText}>{mentor.name}</Text>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.mail}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.designation}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faUserGraduate} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.domain}</Text>
                </View>
              </View>
              <View style={styles.scoreContainer}>
                <TouchableOpacity onPress={() => showReason(mentor)}>
                  <Text style={styles.scoreText}>{mentor.score}</Text>
                </TouchableOpacity>
              </View>
              <Button title="Request" onPress={() => { sendRequest(mentor.id, value) }} />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Other Domain Mentors</Text>
        {other_domain_mentors === null || other_domain_mentors.length === 0 ? (
          <Text style={styles.noRequestsText}>No other domain mentors found at this moment</Text>
        ) : (
          other_domain_mentors.map((mentor: Mentor) => ( // Type mentor variable
            <View key={mentor.id} style={styles.menteeRequest}>
              <View style={styles.mentorInfo}>
                <Text style={styles.nameText}>{mentor.name}</Text>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.mail}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.designation}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesomeIcon icon={faUserGraduate} size={16} color="#777" style={styles.icon} />
                  <Text style={styles.infoText}>{mentor.domain}</Text>
                </View>
              </View>
              <View style={styles.scoreContainer}>
                <TouchableOpacity onPress={() => showReason(mentor)}>
                  <Text style={styles.scoreText}>{mentor.score}</Text>
                </TouchableOpacity>
              </View>
              <Button title="Request" onPress={() => { sendRequest(mentor.id, value) }} />
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedReason}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  content: { flexGrow: 1, padding: 20 },
  noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },

  menteeRequest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#e0faf7', // Light blue background
    borderWidth: 1, // Add border
    borderColor: '#B2EBF2', // Light blue border
  },

  mentorInfo: {
    flex: 1,
  },

  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  icon: {
    marginRight: 8,
    color: '#777',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },

  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B2EBF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff'
  },

  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  dropdownContainer: {
    margin: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CheckCompatibility;