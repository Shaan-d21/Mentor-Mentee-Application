
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

interface Mentor {
  id: string;
  name: string;
  skills: string;
  experience: string;
}

const mentors: Mentor[] = [
  { id: '1', name: 'Mentor Name', skills: 'Skills', experience: 'Experience' },
  { id: '2', name: 'Mentor Name', skills: 'Skills', experience: 'Experience' },
  { id: '3', name: 'Mentor Name', skills: 'Skills', experience: 'Experience' },
  { id: '4', name: 'Mentor Name', skills: 'Skills', experience: 'Experience' },
];

const FindMentorScreen: React.FC = () => {
  const renderMentor = ({ item }: { item: Mentor }) => (
    <View style={styles.mentorCard}>
      <View>
        <Text style={styles.mentorName}>{item.name}</Text>
        <Text style={styles.mentorDetails}>{item.skills}</Text>
        <Text style={styles.mentorDetails}>{item.experience}</Text>
      </View>
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
   <view>
     <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Find your Mentor</Text>
        <Text style={styles.subHeader}>Here are the Top Matches</Text>
      </View>

      <FlatList
        data={mentors}
        renderItem={renderMentor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

    
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Course</Text>
        </TouchableOpacity>
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
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:10,
  },
  subHeader: {
    fontSize: 16,
    color: '#666666',
  },
  listContainer: {
    paddingBottom: 80, // 
  },
  mentorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 10,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mentorDetails: {
    fontSize: 14,
    color: '#666666',
  },
  requestButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FindMentorScreen;
