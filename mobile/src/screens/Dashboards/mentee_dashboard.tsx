// import React, { FC, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   FlatList
// } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// import { ScreenProps } from '../../navigation/types';
// import { fetchMentors } from '../../services/apimentordomain';
// import axios from 'axios';

// const COLUMN_WIDTH = 140;

// const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
//   const userName = useSelector((state: RootState) => state.login.name);
//   const [mentorList, setMentorList] = useState<any[]>([]);
//   const [selectedDomain, setSelectedDomain] = useState('');
//   const [showCompatibilityColumns, setShowCompatibilityColumns] = useState(false);
//   const [requestMentorId, setRequestMentorId] = useState<number | null>(null);

//   const domainOptions = [
//     { label: 'Programming Languages', value: 'Programming Languages' },
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

//   useEffect(() => {
//     const fetchAllMentors = async () => {
//       try {
//         const response = await axios.get('http://181.214.44.15:8080/users/all_users');
//         console.log("All Users Response: ", response.data); // Debugging 👀

//         if (response.data && Array.isArray(response.data)) {
//           // Check if role field exists
//           const mentors = response.data
//             .filter((mentor) => mentor.role?.toLowerCase() === 'mentor') // ✅ Role check
//             .map((mentor) => ({
//               id: mentor.id,
//               name: mentor.name,
//               email: mentor.mail,
//               designation: mentor.designation,
//               techStack: mentor.domain
//             }));

//           setMentorList(mentors);
//           setShowCompatibilityColumns(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch mentors:", error);
//       }
//     };

//     fetchAllMentors();
//   }, []);

//   const sendRequest = (mentorId: number) => {
//     Alert.alert("Request Sent");
//     setRequestMentorId(mentorId);
//   };

//   const handleCheckCompatibility = async () => {
//     if (!selectedDomain) return;

//     try {
//       const data = await fetchMentors(selectedDomain);
//       if (data) {
//         const formattedMentors = [...data.domain_mentors, ...data.other_domain_mentors].map((mentor) => ({
//           id: mentor.id,
//           name: mentor.name,
//           email: mentor.mail,
//           designation: mentor.designation,
//           techStack: mentor.domain,
//           score: mentor.score,
//           action: 'Send Request',
//           comment: mentor.reason
//         }));
//         setMentorList(formattedMentors);
//         setShowCompatibilityColumns(true);
//       }
//     } catch (error) {
//       console.error('Error fetching compatibility mentors:', error);
//     }
//   };

//   const handleDomainSelect = (value: string) => {
//     setSelectedDomain(value);
//   };

//   const renderMentorRow = ({ item }: { item: any }) => (
//     <View style={styles.row}>
//       <Text style={styles.cell}>{item.name}</Text>
//       <Text style={styles.cell}>{item.email}</Text>
//       <Text style={styles.cell}>{item.designation}</Text>
//       <Text style={styles.cell}>{item.techStack}</Text>
//       {showCompatibilityColumns && <Text style={styles.cell}>{item.score}</Text>}
//       {showCompatibilityColumns && (
//         <View style={[styles.cell, { alignItems: 'center' }]}>
//           {requestMentorId === item.id ? (
//             <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
//           ) : (
//             <TouchableOpacity
//               onPress={() => sendRequest(item.id)}
//               disabled={requestMentorId !== null}
//               style={{
//                 backgroundColor: requestMentorId !== null ? '#ccc' : '#007BFF',
//                 padding: 6,
//                 borderRadius: 4
//               }}
//             >
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.action}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//       {showCompatibilityColumns && <Text style={styles.cell}>{item.comment}</Text>}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => {}} />

//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
//       </View>

//       <Dropdown
//         style={styles.dropdown}
//         data={domainOptions}
//         labelField="label"
//         valueField="value"
//         value={selectedDomain}
//         placeholder="Select Domain"
//         onChange={(item: { value: string; label: string }) => handleDomainSelect(item.value)}
//       />


//       <TouchableOpacity
//         style={[styles.checkButton, { backgroundColor: selectedDomain ? '#28a745' : '#ccc' }]}
//         onPress={handleCheckCompatibility}
//         disabled={!selectedDomain}
//       >
//         <Text style={styles.checkButtonText}>Check Compatibility</Text>
//       </TouchableOpacity>

//       <ScrollView horizontal>
//         <View>
//           <View style={styles.headerRow}>
//             <Text style={styles.headerCell}>Mentor Name</Text>
//             <Text style={styles.headerCell}>Email</Text>
//             <Text style={styles.headerCell}>Designation</Text>
//             <Text style={styles.headerCell}>Tech Stack</Text>
//             {showCompatibilityColumns && <Text style={styles.headerCell}>Score</Text>}
//             {showCompatibilityColumns && <Text style={styles.headerCell}>Actions</Text>}
//             {showCompatibilityColumns && <Text style={styles.headerCell}>Comments</Text>}
//           </View>

//           <FlatList
//             data={mentorList}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderMentorRow}
//           />
//         </View>

  
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   headerText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//   dropdown: {
//     marginBottom: 15,
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CCC'
//   },
//   checkButton: {
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   checkButtonText: { color: '#FFF', fontWeight: 'bold' },
//   headerRow: {
//     flexDirection: 'row',
//     backgroundColor: '#444',
//     borderTopLeftRadius: 6,
//     borderTopRightRadius: 6
//   },
//   headerCell: {
//     width: COLUMN_WIDTH,
//     color: '#FFF',
//     fontWeight: 'bold',
//     padding: 10,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#333'
//   },
//   row: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     borderBottomWidth: 1,
//     borderColor: '#EEE'
//   },
//   cell: {
//     width: COLUMN_WIDTH,
//     padding: 10,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#EEE',
//     color: '#333'
//   }
// });

// export default MenteeDashboard;

//PRAJAL'S CODE
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
// import { Avatar } from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../redux/store';
// import { Dropdown } from 'react-native-element-dropdown';
// // import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';

// const MenteeDashboard = () => {  
//   const dispatch = useDispatch<AppDispatch>();

//   const data=[
//     {label: "Programming Languages", value: "Programming Languages"},
//     {label: "Database & Backend", value: "Database & Backend"},
//     {label: "Cloud Computing", value: "Cloud Computing"},
//     {label: "DevOps & Deployment", value: "DevOps & Deployment"},
//     {label: "Artificial Intelligence & Machine Learning", value: "Artificial Intelligence & Machine Learning"},
//     {label: "Data Science & Analytics", value: "Data Science & Analytics"},
//     {label: "Project & Team Management", value: "Project & Team Management"},
//     {label: "Software Development", value: "Software Development"},
//     {label: "Soft Skills", value: "Soft Skills"},
//     {label: "Web Development", value: "Web Development"}
//   ];
//   const {mentorList, requestMentorId}= useSelector((state:RootState)=> state.menteeDashboard)

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
//         {mentorList=== null || mentorList.length === 0 ? (
//           <Text style={styles.noRequestsText}>No mentors found at this moment</Text>
//         ) : 
//         /* List all the mentors */
//         (
//           mentorList.map(mentor => (
//             <View key={mentor.id} style={styles.menteeRequest}>
//               <Text style={styles.text}>Connect with {mentor.name}</Text>
//               {
//                 requestMentorId=== mentor.id ?(
//                   <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
//                 ) : (
//                   <Button
//                 title="Request"
//                 onPress={() => sendRequest(mentor.id, value)}
//                 disabled={requestMentorId !== null} // Disable all other buttons
//               />
//                 )
//               }
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

// export default MenteeDashboard;
import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity // Import TouchableOpacity
} from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBriefcase, faCode, faClock } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'http://181.214.44.15:8080'; // Centralize API base URL

interface Mentor {
  id: number;
  name: string;
  mail: string;
  designation: string | null;
  domain_name: string | null;
  exp: number | null; // Add experience field
}

interface ApiResponse {
  status_code: number;
  message: string;
  object: Mentor[]; // object is an array of mentors
}

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const userName = useSelector((state: RootState) => state.login.name);
  const [mentorList, setMentorList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchAllMentors = async () => {
      setLoading(true); // Set loading to true
      setError(null); // Clear any previous errors
      try {
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/mentee/get-approved-mentors`, { // Use centralized API URL
          headers: {
            'accept': 'application/json',
            'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOYWluZXNoIiwiaWQiOjUxLCJyb2xlIjoibWVudGVlIiwiZXhwIjoxNzQ1NDkzMzgwfQ.qbHkM2-Cl9klHwl_f03fXOVBXHfjeYlYd-I2viq70AU',
          }
        });
        console.log("Approved Mentors Response: ", response.data);
        if (response.data && Array.isArray(response.data.object)) {
          const mentors: Mentor[] = response.data.object.map((mentorData) => ({
            id: mentorData.id,
    name: mentorData.name,
    mail: mentorData.mail, // Changed email to mail here
    designation: mentorData.designation || 'N/A', // Handle null designation
    domain_name: mentorData.domain_name || 'N/A',
    exp: mentorData.exp || null, // Add experience
          }));
          setMentorList(mentors);
        } else {
          setError('Failed to fetch mentors: Invalid data format'); // Set error message
        }
      } catch (err: any) {
        console.error("Failed to fetch approved mentors:", err);
        setError('Failed to fetch mentors: ' + err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };
    fetchAllMentors();
  }, []);

  const renderMentorCard = ({ item }: { item: Mentor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.mail}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.designation}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faCode} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.domain_name}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faClock} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.exp !== null ? `${item.exp} years` : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => { }} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      {/* Check Compatibility Button */}
      <TouchableOpacity
        style={styles.checkCompatibilityButton}
        onPress={() => navigation.navigate('CheckCompatibility')} 
      >
        <Text style={styles.checkCompatibilityButtonText}>Check Compatibility</Text>
      </TouchableOpacity>

      {/* Display loading indicator */}
      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {/* Display error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={mentorList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMentorCard}
        contentContainerStyle={styles.flatListContent} // Add padding to the FlatList
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#E0F7FA', // Light blue background
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1, // Add border
    borderColor: '#B2EBF2', // Light blue border
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: '#B2EBF2',
    paddingBottom: 8,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  cardBody: {
    paddingHorizontal: 5
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  icon: {
    marginRight: 10
  },
  cardText: {
    fontSize: 16,
    color: '#555'
  },
  flatListContent: { // Style for FlatList content
    paddingBottom: 20 // Add bottom padding
  },
  checkCompatibilityButton: { // Style for the Check Compatibility button
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  checkCompatibilityButtonText: { // Style for the Check Compatibility button text
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default MenteeDashboard;