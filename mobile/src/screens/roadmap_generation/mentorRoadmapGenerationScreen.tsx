import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropdownComponent from '../../components/Dropdown';
import { ScreenProps } from '../../navigation/types';
import AppBar from '../../components/appbar_component';
import { fetchApprovedMentees, generateRoadmap } from '../../redux/slices/sliceMentorRoadmap'; // <-- Added
import { AppDispatch, RootState } from '../../redux/store'; // Adjust import to match your store file

export const MentorRoadmapGeneration: FC<ScreenProps<'MentorRoadmapGeneration'>> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mentees, roadmap, status, error } = useSelector((state: RootState) => state.mentorRoadmap);

  const [selectedMentee, setSelectedMentee] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  const domainOptions = [
    { label: 'Programming Languages', value: 'Programming Languages' },
    { label: 'Database & Backend', value: 'Database & Backend' },
    // ...keep or adjust domain items as needed...
  ];

  useEffect(() => {
    dispatch<any>(fetchApprovedMentees()); // Load mentees from API

  }, [dispatch]);

  const handleGenerateRoadmap = () => {
    dispatch<any>(generateRoadmap(selectedDomain));
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => {}} openDrawer={() => {}} />

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
                data={mentees.map((mentee) => ({ label: mentee.name, value: mentee.id.toString() }))}
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

            {/* Example parsing of roadmap if it's JSON */}
            {/* Adjust based on actual data structure from your API */}
            {(() => {
              try {
                const parsed = JSON.parse(roadmap);
                return parsed.topics?.map((topic: string, index: number) => (
                  <View key={index} style={styles.topicCard}>
                    <Text style={styles.topicItem}>{topic}</Text>
                  </View>
                ));
              } catch {
                return <Text>{roadmap}</Text>;
              }
            })()}
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