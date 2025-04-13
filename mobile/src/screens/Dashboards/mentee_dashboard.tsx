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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBriefcase, faCode, faClock, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { apiGetApprovedMentorList } from '../../services/apiMenteeDashboard/apiGetApprovedMentorList';
import { getApprovedMentorList } from '../../redux/slices/sliceMenteeDashboard';

interface Mentor {
  id: number;
  name: string;
  mail: string;
  designation: string | null;
  domain_name: string | null;
  exp: number | null; // Add experience field
}

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const dispatch= useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.login.name);
  // const [mentorList, setMentorList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const mentorList= useSelector((state:RootState)=> state.menteeDashboard.getApprovedMentors);
  
  useEffect(() =>{
    const response= dispatch(getApprovedMentorList());
    console.log("UI", response);
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
          <FontAwesomeIcon icon={faCodeBranch} size={16} color="#777" style={styles.icon} />
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