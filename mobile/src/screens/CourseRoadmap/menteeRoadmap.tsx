// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator,Alert } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { fetchMentors, ApprovedMentor } from '../../redux/slices/sliceMenteeRoadmap';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/types';
// import { getRoadmapTopics } from '../../services/apiRoadmap/apiGetRoadmap';
// import AppBar from '../../components/appbar_component';

// type MenteeRoadmapNavProp = NativeStackNavigationProp<RootStackParamList, 'MenteeRoadmap'>;

// const MenteeRoadmap = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation<MenteeRoadmapNavProp>();

//   // Extracting mentor data from Redux store
//   const { mentorsAndDomain, loading, error } = useSelector((state: RootState) => state.menteeRoadmap);

//   useEffect(() => {
//     dispatch(fetchMentors());
//   }, [dispatch]);

//   // const handleViewRoadmap = (mentor_id: number, domain_name: string, domain_id: number) => {
//   //   navigation.navigate('RoadmapScreen', { mentor_id: mentor_id, domain_name: domain_name, domain_id: domain_id });
//   // };
//   const handleViewRoadmap = async (mentor_id: number, domain_name: string, domain_id: number) => {
//     try {
//       // Call getRoadmapTopics to check if the roadmap exists
//       await getRoadmapTopics(mentor_id, domain_id);

//       // If the API call is successful (no error thrown), navigate to RoadmapScreen
//       navigation.navigate('RoadmapScreen', { mentor_id: mentor_id, domain_name: domain_name, domain_id: domain_id });
//     } catch (error: any) {
//       // If a 404 error is caught, display an alert message
//       if (error.response && error.response.status === 404) {
//         Alert.alert(
//           "Roadmap Not Assigned",
//           "The roadmap for this mentor and domain has not been assigned yet.",
//           [{ text: "OK" }]
//         );
//       } else {
//         // Handle other errors (e.g., network errors)
//         console.error("Error checking roadmap:", error);
//         Alert.alert(
//           "Error",
//           "An error occurred while checking the roadmap.",
//           [{ text: "OK" }]
//         );
//       }
//     }
//   };

//   const renderItem = ({ item }: { item: ApprovedMentor }) => (
    
//     <View style={styles.tableRow}>
//       <View style={styles.infoContainer}>
//         <Text style={styles.headerText}>Mentor Name:</Text>
//         <Text style={styles.dataText}>{item.mentor_name}</Text>
//       </View>
//       <View style={styles.infoContainer}>
//         <Text style={styles.headerText}>Domain:</Text>
//         <Text style={styles.dataText}>{item.domain_name}</Text>
//       </View>
//       <TouchableOpacity style={styles.button} onPress={() => handleViewRoadmap(item.mentor_id, item.domain_name, item.domain_id)} >
//         <Text style={styles.buttonText}>View Roadmap</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const ListHeader = () => (
//     <View style={styles.headerContainer}>
//       <AppBar openDrawer={() => { }} onProfilePress={() => { }} />
//       {/* <Text style={styles.title}>View Roadmap</Text> */}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#007bff" />
//         </View>
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>Error: {error}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={mentorsAndDomain}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.mentor_id.toString()}
//           ListHeaderComponent={ListHeader}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   headerContainer: {
//     paddingBottom: 10, // Add some spacing between the header and the list
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 20,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   tableRow: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   infoContainer: {
//     marginBottom: 10,
//   },
//   headerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   dataText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//   },
// });

// export default MenteeRoadmap;


import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMentors, ApprovedMentor } from '../../redux/slices/sliceMenteeRoadmap';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { apiGetTopicsOnMenteeScreen } from '../../services/apiRoadmap/apiGetRoadmap';
import AppBar from '../../components/appbar_component';

type MenteeRoadmapNavProp = NativeStackNavigationProp<RootStackParamList, 'MenteeRoadmap'>;

const MenteeRoadmap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<MenteeRoadmapNavProp>();

  const { mentorsAndDomain, loading, error } = useSelector(
    (state: RootState) => state.menteeRoadmap
  );

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  const handleViewRoadmap = async (roadmap_id:number) => {
    try {
      await apiGetTopicsOnMenteeScreen(roadmap_id);
      navigation.navigate('RoadmapScreen', {
        roadmap_id:roadmap_id,
      });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        Alert.alert(
          'Roadmap Not Assigned',
          'The roadmap for this domain has not been assigned yet.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('Error checking roadmap:', error);
        Alert.alert('Error', 'An error occurred while checking the roadmap.', [{ text: 'OK' }]);
      }
    }
  };

  const renderItem = ({ item }: { item: ApprovedMentor }) => (
    <View style={styles.tableRow}>
      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>Mentor Name:</Text>
        <Text style={styles.dataText}>{item.mentor_name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>Domain:</Text>
        <Text style={styles.dataText}>{item.domain_name}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleViewRoadmap(item.roadmap_id)}
      >
        <Text style={styles.buttonText}>View Roadmap</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
<AppBar 
  openDrawer={() => {}} 
  onProfilePress={() => navigation.navigate('MenteeProfileScreen')} 
  title="View Roadmap" 
/>      {/* <Text style={styles.title}>View Roadmap</Text> */}
    </View>
  );

  return (
    <View style={styles.container}>
      
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={mentorsAndDomain}
          renderItem={renderItem}
          keyExtractor={(item) => item.mentor_id.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No mentors assigned</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  headerContainer: {
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10
  },
  tableRow: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  infoContainer: {
    marginBottom: 10
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  dataText: {
    fontSize: 14,
    color: '#555'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 16,
    color: 'red'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#777'
  }
});

export default MenteeRoadmap;
