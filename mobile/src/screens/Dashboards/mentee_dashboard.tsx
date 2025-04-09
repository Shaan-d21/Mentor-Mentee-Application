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
// import { fetchMentors } from '../../services/apiMenteeDashboard/apimentordomain';
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
//         const response = await axios.get('http://181.214.44.15:8080/mentee/get-approved-mentors', {
//           headers: {
//             'accept': 'application/json',
//             'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzb2hhbXMiLCJpZCI6NDEsInJvbGUiOiJtZW50ZWUiLCJleHAiOjE3NDUzOTM5Mzd9.5WdcaF2vgXIouz6YSh0HzpzvgcFPLkuyH7w68fOqxOI'
//           }
//         });
//         if (response.data && Array.isArray(response.data)) {
//           const mentors = response.data.map((mentor) => ({
//             id: mentor.id,
//             name: mentor.name,
//             email: mentor.mail,
//             designation: mentor.designation,
//             techStack: mentor.domain
//           }));
//           setMentorList(mentors);
//           setShowCompatibilityColumns(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch approved mentors:", error);
//       }
//     };
//     fetchAllMentors();
//   }, []);

//   const sendRequest = async (mentorId: number) => {
//     if (!selectedDomain) {
//       Alert.alert("Please select a domain before sending a request.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://181.214.44.15:8080/mentee/mentorship',
//         {
//           domain: selectedDomain,
//           mentor_id: mentorId
//         },
//         {
//           headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzb2hhbXMiLCJpZCI6NDEsInJvbGUiOiJtZW50ZWUiLCJleHAiOjE3NDUzOTM5Mzd9.5WdcaF2vgXIouz6YSh0HzpzvgcFPLkuyH7w68fOqxOI'
//           }
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert("Request Sent Successfully");
//         setRequestMentorId(mentorId);
//       } else {
//         Alert.alert("Request Failed", "Unexpected server response.");
//       }
//     } catch (error) {
//       console.error("Error sending request:", error);
//       Alert.alert("Request Failed", "Something went wrong. Try again later.");
//     }
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
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.action || 'Send Request'}</Text>
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



import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dropdown } from 'react-native-element-dropdown';
import { ScreenProps } from '../../navigation/types';
import { fetchMentors } from '../../services/apiMenteeDashboard/apimentordomain';
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const COLUMN_WIDTH = 140;

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const userName = useSelector((state: RootState) => state.login.name);
  const [mentorList, setMentorList] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showCompatibilityColumns, setShowCompatibilityColumns] = useState(false);
  const [requestMentorId, setRequestMentorId] = useState<number | null>(null);

  const domainOptions = [
    { label: 'Programming Languages', value: 'Programming Languages' },
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
  const storage= new MMKV();

  useEffect(() => {
    const fetchAllMentors = async () => {
      try {
        const response = await axios.get('http://181.214.44.15:8080/mentee/get-approved-mentors', {
          headers: {
            'accept': 'application/json',
            'Token': storage.getString("token")
          }
        });
        if (response.data && Array.isArray(response.data)) {
          const mentors = response.data.map((mentor) => ({
            id: mentor.id,
            name: mentor.name,
            email: mentor.mail,
            designation: mentor.designation,
            techStack: mentor.domain
          }));
          setMentorList(mentors);
          setShowCompatibilityColumns(false);
        }
      } catch (error) {
        console.error("Failed to fetch approved mentors:", error);
      }
    };
    fetchAllMentors();
  }, []);

  const sendRequest = async (mentorId: number) => {
    if (!selectedDomain) {
      Alert.alert("Please select a domain before sending a request.");
      return;
    }

    try {
      console.log('sendRequest');
      console.log(`SelectedDomain: ${selectedDomain}`);
      console.log(`MentorId: ${mentorId} hehe`);
      const response = await axios.post(
        'http://181.214.44.15:8080/mentee/mentorship',
        {
          domain: selectedDomain,
          mentor_id: mentorId
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': storage.getString("token")
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Request Sent Successfully");
        setRequestMentorId(mentorId);
      } else {
        Alert.alert("Request Failed", "Unexpected server response.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      Alert.alert("Request Failed", "Something went wrong. Try again later.");
    }
  };

  const handleCheckCompatibility = async () => {
    if (!selectedDomain) return;

    try {
      const data = await fetchMentors(selectedDomain);
      if (data) {
        const formattedMentors = [...data.domain_mentors, ...data.other_domain_mentors].map((mentor) => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.mail,
          designation: mentor.designation,
          techStack: mentor.domain,
          score: mentor.score,
          action: 'Send Request',
          comment: mentor.reason
        }));
        setMentorList(formattedMentors);
        setShowCompatibilityColumns(true);
      }
    } catch (error) {
      console.error('Error fetching compatibility mentors:', error);
    }
  };

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
  };

  const renderMentorRow = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.designation}</Text>
      <Text style={styles.cell}>{item.techStack}</Text>
      {showCompatibilityColumns && <Text style={styles.cell}>{item.score}</Text>}
      {showCompatibilityColumns && (
        <View style={[styles.cell, { alignItems: 'center' }]}>
          {requestMentorId === item.id ? (
            <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
          ) : (
            <TouchableOpacity
              onPress={() => sendRequest(item.id)}
              disabled={requestMentorId !== null}
              style={{
                backgroundColor: requestMentorId !== null ? '#ccc' : '#007BFF',
                padding: 6,
                borderRadius: 4
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.action || 'Send Request'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {showCompatibilityColumns && <Text style={styles.cell}>{item.comment}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => {}} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      <Dropdown
        style={styles.dropdown}
        data={domainOptions}
        labelField="label"
        valueField="value"
        value={selectedDomain}
        placeholder="Select Domain"
        onChange={(item: { value: string; label: string }) => handleDomainSelect(item.value)}
      />

      <TouchableOpacity
        style={[styles.checkButton, { backgroundColor: selectedDomain ? '#28a745' : '#ccc' }]}
        onPress={handleCheckCompatibility}
        disabled={!selectedDomain}
      >
        <Text style={styles.checkButtonText}>Find Mentors</Text>
      </TouchableOpacity>

      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Mentor Name</Text>
            <Text style={styles.headerCell}>Email</Text>
            <Text style={styles.headerCell}>Designation</Text>
            <Text style={styles.headerCell}>Tech Stack</Text>
            {showCompatibilityColumns && <Text style={styles.headerCell}>Score</Text>}
            {showCompatibilityColumns && <Text style={styles.headerCell}>Actions</Text>}
            {showCompatibilityColumns && <Text style={styles.headerCell}>Comments</Text>}
          </View>

          <FlatList
            data={mentorList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMentorRow}
          />
        </View>
      </ScrollView>
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
  dropdown: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  checkButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  checkButtonText: { color: '#FFF', fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#444',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  headerCell: {
    width: COLUMN_WIDTH,
    color: '#FFF',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#333'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  cell: {
    width: COLUMN_WIDTH,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#EEE',
    color: '#333'
  }
});

export default MenteeDashboard;