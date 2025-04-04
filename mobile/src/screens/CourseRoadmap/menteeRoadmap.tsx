import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMentors } from '../../redux/slices/sliceMenteeRoadmap';

const MenteeRoadmap = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Extracting mentor data from Redux store
  const { mentorsAndDomain, loading, error } = useSelector((state: RootState) => state.menteeRoadmap);

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  const renderItem = ({ item }: { item: { mentor_id: number; mentor_name: string; domain_name: string } }) => (
    <View style={styles.tableRow}>
      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>Mentor Name:</Text>
        <Text style={styles.dataText}>{item.mentor_name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>Domain:</Text>
        <Text style={styles.dataText}>{item.domain_name}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Roadmap</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mentorsAndDomain}
        renderItem={renderItem}
        keyExtractor={(item) => item.mentor_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    elevation: 2,
  },
  infoContainer: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default MenteeRoadmap;