import React, { FC, use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropdownComponent from '../../components/Dropdown';
import { ScreenProps } from '../../navigation/types';
import AppBar from '../../components/appbar_component';
import { fetchApprovedMentees, generateRoadmap, assignRoadmap, initialStateMentorRoadmap } from '../../redux/slices/sliceMentorRoadmap'; // <-- Added
import { AppDispatch, RootState } from '../../redux/store'; // Adjust import to match your store file
import { ListRoadmapItems } from '../../components/roadmap/RoadmapListItemsComponent';
import DomainView from '../../components/roadmap/domainView';
import { MMKV } from 'react-native-mmkv';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const MentorRoadmapGeneration: FC<ScreenProps<'MentorRoadmapGeneration'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mentees, roadmap, status, error, roadmapId, assignStatus } = useSelector((state: RootState) => state.mentorRoadmap);

  const [selectedMentee, setSelectedMentee] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const storage = new MMKV();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      dispatch(initialStateMentorRoadmap())
      dispatch(fetchApprovedMentees());

    }
  }, [isFocused]);


  useEffect(() => {
    dispatch(fetchApprovedMentees());

  }, [dispatch]);

  useEffect(() => {
    if (assignStatus === 1) {
      Alert.alert("Roadmap Assigned Successfully", "The roadmap has been assigned to the mentee successfully.",);
    }

  }, [assignStatus]);
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK" }]);
    }
  }
    , [error]);



  const handleGenerateRoadmap = () => {
    dispatch(generateRoadmap({
      domainId: mentees.find((mentee) => mentee.name === selectedMentee)?.domain_id.toString() || '',
      id:
        mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || ''
    }));
    console.log("Selected Mentee ID:", mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '');
    console.log("Selected Domain:", selectedDomain);
    console.log("Selected Mentee Name:", selectedMentee);
    console.log("Selected Domain ID:", mentees.find((mentee) => mentee.name === selectedMentee)?.domain_id.toString() || '');
    console.log("Roadmap:", roadmap);
  };

  const handleAssignRoadmap = () => {
    console.log("Roadmap ID:", roadmapId);
    console.log("Selected Mentee ID:", mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '');
    console.log("Selected Domain:", selectedDomain);
   
    dispatch(assignRoadmap({ roadmapId: roadmapId || "", menteeId: mentees.find((mentee) => mentee.name === selectedMentee)?.id.toString() || '', domainId: mentees.find((mentee) => mentee.name === selectedMentee)?.domain_id.toString() || '' }));
    console.log("Selected Mentee Name:", selectedMentee);
    dispatch(initialStateMentorRoadmap())
    dispatch(fetchApprovedMentees());
  };

  return (
    <View style={styles.container}>
      {
        !roadmap && (<AppBar onProfilePress={() => { navigation.navigate("MentorProfileScreen") }} openDrawer={() => { }} />)
      }

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {status === 'loading' && (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        )}

        {status !== 'loading' && mentees.length === 0 && (
          <View style={styles.noMenteesContainer}>
            <Text style={styles.noMenteesText}>No mentees found.</Text>
            <Text style={styles.noMenteesSubText}>Please add mentees to generate a roadmap.</Text>
          </View>
        )}


        {status !== 'loading' && mentees.length > 0 && !roadmap && (
          <>

            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Select Mentee</Text>
              <DropdownComponent
                data={mentees.map((mentee) => ({ label: mentee.name, value: mentee.name }))}
                selectedValue={selectedMentee}
                onSelect={(value) => {
                  setSelectedMentee(value);
                  setSelectedDomain(
                    mentees.find((mentee) => mentee.name === value)?.domain_name.toString() || '');
                }}
              />
            </View>

            <View style={styles.dropdownContainer}><Text style={styles.label}>
              {selectedMentee ? `Domain for ${selectedMentee}` : 'Domain'}
            </Text>
              <DomainView label={selectedDomain} value={selectedDomain} />
            </View>
          </>
        )}

        {roadmap && (
          <View style={styles.topicsWrapper}>


            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

              <TouchableOpacity
                style={{
                  marginTop: 12,
                }}
                onPress={() => {
                  dispatch(initialStateMentorRoadmap())
                  dispatch(fetchApprovedMentees());
                }}>
                <FontAwesomeIcon icon={faArrowLeft} size={24} color="#007bff" />
              </TouchableOpacity>

              <Text style={styles.header}>
                {selectedDomain || 'Your Domain'} Roadmap for {selectedMentee || 'Your Mentee'}
              </Text>
            </View>
            <ListRoadmapItems roadmap={roadmap} />

          </View>
        )}
      </ScrollView>

      {!roadmap && status !== 'loading' && mentees.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={handleGenerateRoadmap}>
            <Text style={styles.buttonText}>Generate Roadmap</Text>
          </TouchableOpacity>
        </View>
      )}
      {roadmap && status !== 'loading' && mentees.length > 0 && (
        <View style={styles.bottomBar}>
          {/* <TouchableOpacity style={styles.button} onPress={handleAssignRoadmap}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={handleAssignRoadmap}>
            <Text style={styles.buttonText}>Assign to {selectedMentee}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    margin: 12,

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
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  noMenteesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMenteesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMenteesSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});