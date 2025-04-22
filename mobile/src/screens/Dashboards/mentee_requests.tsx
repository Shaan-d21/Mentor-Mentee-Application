import React, {useState, useEffect, FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppBar from '../../components/appbar_component';
import {ScreenProps} from '../../navigation/types';
import {apiGetRequests} from '../../services/apiGetRequests';
import {useDispatch, useSelector} from 'react-redux';
import {cancelRequest} from '../../redux/slices/slicecancelRequest';
import type {AppDispatch} from '../../redux/store'; // Adjust the path to your store file
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';

export interface Request {
  mentor_id: number;
  mentor_name: string;
  mentor_mail: string;
  mentor_designation: string;
  domain_name: string;
  status: string;
  comment: string | null;
  exp: number | null;
}

const MenteeRequests: FC<ScreenProps<'MenteeRequests'>> = ({navigation}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>(); // Use the correct type for dispatch

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiGetRequests();
        setRequests(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCancelRequest = async (mentorId: number) => {
    try {
      await dispatch(cancelRequest(mentorId)).unwrap();
      setRequests(prevRequests =>
        prevRequests.filter(request => request.mentor_id !== mentorId),
      );
      Alert.alert('Request canceled successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'Failed to cancel the request.');
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };
  const renderItem = ({item}: {item: Request}) => {
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
            <Text style={styles.cardText}>Email: {item.mentor_mail}</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardText}>
              Designation: {item.mentor_designation}
            </Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardText}>Domain: {item.domain_name}</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={[styles.cardText, {color: statusColor}]}>
              Status: {item.status}
            </Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardText}>
              Comment:{' '}
              {item.comment !== null && item.comment !== ''
                ? item.comment
                : '-'}
            </Text>
          </View>
          {item.status === 'pending' && (
            <View style={styles.cardItem}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRequest(item.mentor_id)}>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size={16}
                  color="#e74c3c"
                  style={styles.icon}
                />

                <Text style={styles.cancelButtonText}>Cancel Request</Text>
              </TouchableOpacity>
            </View>
          )}
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
      <AppBar
        onProfilePress={() => {
          navigation.navigate('MenteeProfileScreen');
        }}
        openDrawer={() => {}}
        title="My Requests"
      />
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={item => item.mentor_id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5', padding: 20},
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: '#B2EBF2',
    paddingBottom: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    paddingHorizontal: 5,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fdecea',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default MenteeRequests;
