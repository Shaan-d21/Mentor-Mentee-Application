import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const MenteeRequests: React.FC = () => {
  return (
    
    <view>
      
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Mentee Requests</Text>
      <Text style={styles.subHeader}>You Have Some New Requests</Text>

      {/* Mentee Request Card */}
      <View style={styles.requestCard}>
        <Text style={styles.requestText}>
          You have a new request from <Text style={styles.boldText}>Mentee Name</Text>
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </view>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'left',
    margin:20
  

  },
  requestCard: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    margin:20
  },
  requestText: {
    fontSize: 16,

  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#008000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 10,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  declineButton: {
    borderColor: '#008000',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  declineButtonText: {
    color: '#008000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MenteeRequests;
