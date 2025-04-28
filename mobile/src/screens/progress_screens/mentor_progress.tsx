import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { RootStackParamList, ScreenProps } from '../../navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  completeTopic,
  fetchRoadmap,
  reassignTopic,
} from '../../redux/slices/sliceMentorProgress';
import { AppDispatch, RootState } from '../../redux/store';
import AppBar from '../../components/appbar_component';

interface Topic {
  topic_id: number;
  name: string;
  description: string;
  subtopics: String[];
  importance: string;
  topic_status: string;
}

type MentorProgressRouteProp = RouteProp<RootStackParamList, 'MentorProgress'>;

const MentorProgress: React.FC<ScreenProps<'MentorProgress'>> = ({ navigation }) => {
  const route = useRoute<MentorProgressRouteProp>();
  const { roadmap_id, mentee_id } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const topics = useSelector((state: RootState) => state.mentorProgress);
  const completedTopics = topics.completedTopics;
  const markedTopics = topics.markedTopics;
  const assignedTopics = topics.assignedTopics;
  const mergedTopics = [...markedTopics, ...assignedTopics];

  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedAction, setSelectedAction] = useState<'reassign' | 'approve' | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleAction = (action: 'reassign' | 'approve', topic: Topic) => {
    setSelectedAction(action);
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!selectedTopic || !selectedAction) return;

    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }

    if (selectedAction === 'reassign') {
      dispatch(reassignTopic({ mentee_id, topic_id: selectedTopic.topic_id, feedback }));
    } else {
      dispatch(completeTopic({ mentee_id, topic_id: selectedTopic.topic_id, feedback }));
    }

    setModalVisible(false);
    setFeedback('');
    setSelectedTopic(null);
    setSelectedAction(null);
  };

  const renderTopic = ({ item }: { item: Topic }) => {
    return (
      <View style={styles.topicCard}>
        <View style={styles.topicContent}>
          <Text style={styles.topicTitle}>{item.name}</Text>
          <Text style={styles.topicDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.topicInfo}>Importance: {item.importance}</Text>
        </View>

        {item.topic_status === 'marked' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.reassignButton]}
              onPress={() => handleAction('reassign', item)}
            >
              <Text style={styles.actionText}>Reassign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAction('approve', item)}
            >
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (!roadmap_id) {
      Alert.alert('Error', 'No Roadmap Assigned yet.', [
        { text: 'Cancel', onPress: () => navigation.pop(), style: 'cancel' },
      ]);
    } else {
      dispatch(fetchRoadmap(roadmap_id));
    }
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}
        title= "Mentee Progress"
        openDrawer={() => {}}
      />
      <View style={styles.container}>

        <FlatList
          data={mergedTopics}
          renderItem={renderTopic}
          keyExtractor={(item) => item.topic_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {selectedAction === 'reassign' ? 'Reassign Topic' : 'Approve Topic'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder={
                selectedAction === 'approve'
                  ? 'feedback on topic approval'
                  : 'Please provide reason for reassignment'
              }
              value={feedback}
              onChangeText={setFeedback}
              multiline
              
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: selectedAction === 'approve' ? '#4CAF50' : '#f44336',
                },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setFeedback('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  topicCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  topicContent: {
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  topicDesc: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  topicInfo: {
    fontSize: 13,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reassignButton: {
    backgroundColor: '#FFCDD2',
  },
  acceptButton: {
    backgroundColor: '#C8E6C9',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  backButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalInput: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    maxHeight: 150, 
    
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MentorProgress;
