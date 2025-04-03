import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchMenteeRequests, acceptMentee, rejectMenteeWithReason } from '../../redux/slices/menteeRequestSlice';

const MentorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchMenteeRequests());
  }, [dispatch]);

  const { pendingRequests, acceptedRequests } = useSelector((state: RootState) => state.menteeRequests);

  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({});

  const handleReject = (menteeId: string) => {
    if (rejectionReasons[menteeId]) {
      dispatch(rejectMenteeWithReason({ id: menteeId, reason: rejectionReasons[menteeId] }));
      setShowInput(prev => ({ ...prev, [menteeId]: false }));
    }
  };

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => {}} openDrawer={() => {}} />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, Mentor 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {pendingRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>No requests at the moment</Text>
        ) : (
          pendingRequests.map(mentee => (
            <View key={mentee.id} style={styles.menteeRequest}>
              <Text style={styles.text}>{mentee.name} has requested to connect</Text>
              
              {showInput[mentee.id] ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter rejection reason..."
                    value={rejectionReasons[mentee.id] || ''}
                    onChangeText={(text) => setRejectionReasons(prev => ({ ...prev, [mentee.id]: text }))}
                  />
                  <Button title="Send" color="red" onPress={() => handleReject(mentee.id)} />
                </>
              ) : (
                <View style={styles.buttons}>
                  <Button title="Accept" onPress={() => dispatch(acceptMentee(mentee.id))} />
                  <Button 
                    title="Reject" 
                    color="red" 
                    onPress={() => setShowInput(prev => ({ ...prev, [mentee.id]: true }))} 
                  />
                </View>
              )}
            </View>
          ))
        )}

        {acceptedRequests.length > 0 && (
          <>
            <Text style={styles.acceptedTitle}>Accepted Mentees</Text>
            {acceptedRequests.map(mentee => (
              <Text key={mentee.id} style={styles.acceptedMentee}>{mentee.name}</Text>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  content: { flexGrow: 1, padding: 20 },
  noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },
  
  menteeRequest: { 
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#FFF9C4',
  },

  text: { fontSize: 18, fontWeight: '600' },

  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 5, 
    backgroundColor: '#fff' 
  },

  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

  acceptedTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  acceptedMentee: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    padding: 12, 
    marginVertical: 5, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: '#4CAF50', 
    backgroundColor: '#E8F5E9',
    textAlign: 'center' 
  },
});

export default MentorDashboard;
