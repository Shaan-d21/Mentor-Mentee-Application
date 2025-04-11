import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import AppBar from '../../components/appbar_component';
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Removed import
// import { faEnvelope, faBriefcase, faCode, faClock } from '@fortawesome/free-solid-svg-icons'; // Removed import

interface Request {
  mentor_name: string;
  mentor_mail: string;
  mentor_designation: string;
  domain_name: string;
  status: string;
  comment: string | null;
  exp: number | null;
}

const storage = new MMKV();

const MenteeRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = storage.getString('token');
        const response = await axios.get<Request[]>('http://181.214.44.15:8080/mentee/Requests', {
          headers: {
            'accept': 'application/json',
            'Token': token,
          }
        });
        setRequests(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderItem = ({ item }: { item: Request }) => {
    let statusColor = '#000';
    if (item.status === 'approved') {
      statusColor = 'green';
    } else if (item.status === 'pending') {
      statusColor = 'orange';
    } else if (item.status === 'not approved') {
      statusColor = 'red';
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.mentor_name}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardItem}>
            {/* <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} /> */}
            <Text style={styles.cardText}>Email: {item.mentor_mail}</Text>
          </View>
          <View style={styles.cardItem}>
            {/* <FontAwesomeIcon icon={faBriefcase} size={16} color="#777" style={styles.icon} /> */}
            <Text style={styles.cardText}>Designation: {item.mentor_designation}</Text>
          </View>
          <View style={styles.cardItem}>
            {/* <FontAwesomeIcon icon={faCode} size={16} color="#777" style={styles.icon} /> */}
            <Text style={styles.cardText}>Domain: {item.domain_name}</Text>
          </View>
          <View style={styles.cardItem}>
            {/* <FontAwesomeIcon icon={faClock} size={16} color="#777" style={styles.icon} /> */}
            <Text style={[styles.cardText, { color: statusColor }]}>Status: {item.status}</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardText}>Comment: {item.comment !== null && item.comment !== "" ? item.comment : '-'}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => { }} openDrawer={() => { }} title='My Requests'/>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
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
    backgroundColor: 'transparent', // Light blue background
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

export default MenteeRequests;