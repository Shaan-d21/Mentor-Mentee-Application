import React, { FC, use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropdownComponent from '../../components/Dropdown';
import { ScreenProps } from '../../navigation/types';
import AppBar from '../../components/appbar_component';
import { fetchApprovedMentees, generateRoadmap,assignRoadmap } from '../../redux/slices/sliceMentorRoadmap'; // <-- Added
import { AppDispatch, RootState } from '../../redux/store'; // Adjust import to match your store file
import { ListRoadmapItems } from '../../components/RoadmapListItemsComponent';

export const MentorRoadmapGeneration: FC<ScreenProps<'MentorRoadmapGeneration'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mentees, roadmap, status, error,assign,roadmapId } = useSelector((state: RootState) => state.mentorRoadmap);

  const [selectedMentee, setSelectedMentee] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  const domainOptions = [
    { label: "Programming Languages", value: "Programming Languages" },
    { label: "Database & Backend", value: "Database & Backend" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "DevOps & Deployment", value: "DevOps & Deployment" },
    { label: "Artificial Intelligence & Machine Learning", value: "Artificial Intelligence & Machine Learning" },
    { label: "Data Science & Analytics", value: "Data Science & Analytics" },
    { label: "Project & Team Management", value: "Project & Team Management" },
    { label: "Software Development", value: "Software Development" },
    { label: "Soft Skills", value: "Soft Skills" },
    { label: "Web Development", value: "Web Development" }
  ];

  useEffect(() => {
    dispatch(fetchApprovedMentees()); // Load mentees from API

  }, [dispatch]);

useEffect(() => {
  if (assign === 1) {
    navigation.navigate('MentorDashboard'); // Navigate to MentorDashboard on successful assignment
  }
}, [assign, navigation]);

  const handleGenerateRoadmap = () => {
    dispatch(generateRoadmap({
      domain: selectedDomain, id:
        mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || ''
    }));
    console.log("Selected Mentee ID:", mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '');
    console.log("Selected Domain:", selectedDomain);
    console.log("Selected Mentee Name:", selectedMentee);
    console.log("Roadmap:", roadmap);
  };

  const handleAssignRoadmap = () => {
console.log("Roadmap ID:", roadmapId);
console.log("Selected Mentee ID:", mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '');
    console.log("Selected Domain:", selectedDomain);
    dispatch(assignRoadmap({ roadmapId: roadmapId||"", menteeId: mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '',domainId:"1" }));
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => { }} openDrawer={() => { }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {status === 'loading' && (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        )}

        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}

        {status !== 'loading' && !roadmap && (
          <>
            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Select Mentee</Text>
              <DropdownComponent
                data={mentees.map((mentee) => ({ label: mentee.name, value: mentee.name.toString() }))}
                selectedValue={selectedMentee}
                onSelect={(value) => setSelectedMentee(value)}
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Select Domain</Text>
              <DropdownComponent
                data={domainOptions}
                selectedValue={selectedDomain}
                onSelect={(value) => setSelectedDomain(value)}
              />
            </View>
          </>
        )}

        {roadmap && (
          <View style={styles.topicsWrapper}>
            <Text style={styles.header}>
              {selectedDomain || 'Your Domain'} Roadmap for {selectedMentee || 'Your Mentee'}
            </Text>

            <ListRoadmapItems roadmap={roadmap} />

          </View>
        )}
      </ScrollView>

      {!roadmap && status !== 'loading' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={handleGenerateRoadmap}>
            <Text style={styles.buttonText}>Generate Roadmap</Text>
          </TouchableOpacity>
        </View>
      )}
      {roadmap && status !== 'loading' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={handleAssignRoadmap}>
            <Text style={styles.buttonText}>Assign to {selectedMentee}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ...existing styles...
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '700',
    fontSize: 18,
    color: '#000',
  },
  topicsWrapper: {
    marginVertical: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  topicCard: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff9d9',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicItem: {
    fontSize: 16,
    color: '#000',
  },
  bottomBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});