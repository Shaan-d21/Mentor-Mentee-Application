import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faEdit, 
  faPlus, 
  faChevronDown, 
  faChevronUp,
  faInfo,
  faCheckCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { RoadmapResponse, RoadmapTopic } from '../../types/RoadmapTypes';
import RoadmapEditModal from './RoadmapEditModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { addRoadmapTopic, editRoadmapTopic } from '../../redux/slices/sliceMenteeRoadmap';
import { deleteRoadmapThunk } from "../../redux/slices/sliceRoadmapTopics";
import { apiDeleteTopic } from '../../services/apiRoadmap/apiGenerateRoadmapMentor';


export const ListRoadmapItems = (props: { roadmap: RoadmapResponse }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [localRoadmap, setLocalRoadmap] = useState<RoadmapResponse>(props.roadmap);
  
  // Update local state when props change
  useEffect(() => {
    setLocalRoadmap(props.roadmap);
  }, [props.roadmap]);
  
  // State for expanded/collapsed topics
  const [expandedTopics, setExpandedTopics] = useState<number[]>([]);


   
  // State for editing
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<RoadmapTopic | null>(null);
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);
  const [expandedImportance, setExpandedImportance] = useState<number | null>(null);

  const toggleImportanceExpansion = (topicId: number) => {
    setExpandedImportance(expandedImportance === topicId ? null : topicId);
  };
  
  // Functions to handle topic expansion
  const toggleTopicExpansion = (topicId: number) => {
    if (expandedTopics.includes(topicId)) {
      setExpandedTopics(expandedTopics.filter(id => id !== topicId));
    } else {
      setExpandedTopics([...expandedTopics, topicId]);
    }
  };
  
  // Start editing a topic
  const handleStartEdit = (topic: RoadmapTopic) => {
    setIsAddingTopic(false);
    setEditingTopic(topic);
    setEditMode(true);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingTopic(null);
    setIsAddingTopic(false);
  };
  
  // Save edited topic
  const handleSaveEdit = async (editedTopic: RoadmapTopic) => {
    try {
      // If we are adding a new topic
      if (isAddingTopic) {
        const { topic_id, topic_status, ...topicData } = editedTopic;
        const result = await dispatch(addRoadmapTopic({
          roadmapId: localRoadmap.roadmap_id,
          topicData:editedTopic
        })).unwrap();
        
        // Add the new topic to the local state
        const updatedRoadmap = {
          ...localRoadmap,
          topics: [...localRoadmap.topics, result]
        };
        setLocalRoadmap(updatedRoadmap);
        Alert.alert("Success", "Topic added successfully!");
      } 
      // If we are editing an existing topic
      else {
        const result = await dispatch(editRoadmapTopic(editedTopic)).unwrap();
        
        // Update the topic in the local state
        const updatedTopics = localRoadmap.topics.map(topic => 
          topic.topic_id === editedTopic.topic_id ? editedTopic : topic
        );
        
        setLocalRoadmap({
          ...localRoadmap,
          topics: updatedTopics
        });
        Alert.alert("Success", "Topic updated successfully!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.toString() || "Failed to save changes");
    } finally {
      setEditMode(false);
      setEditingTopic(null);
      setIsAddingTopic(false);
    }
  };
  
  // Add a new topic
  const handleAddTopic = () => {
    // Create an empty topic template
    const newTopic: RoadmapTopic = {
      topic_id: -1,
      name: "",
      description: "",
      subtopics: [""],
      importance: "",
      topic_status: "pending"
    };
    
    setIsAddingTopic(true);
    setEditingTopic(newTopic);
    setEditMode(true);
  };

  // useEffect(()=>{
  //   apiDeleteTopic(4719)
  // },[])
  const handleDeleteTopic = (topic_id: number) => {
    Alert.alert(
      "Delete Topic",
      "Are you sure you want to delete this topic?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Attempting to delete topic with ID:", topic_id);
              console.log(localRoadmap.topics);
              const result = await dispatch(deleteRoadmapThunk(topic_id)).unwrap();
              console.log("Deleted topic successfully:", result);
              
              // Update the local state after deletion
              const updatedTopics = localRoadmap.topics.filter((topic) => topic.topic_id !== topic_id);
              setLocalRoadmap({
                ...localRoadmap,
                topics: updatedTopics,
              });

              console.log(localRoadmap.topics); // Log the updated topics

      setEditMode(false);
    setEditingTopic(null);
    setIsAddingTopic(false);
              Alert.alert("Deleted", "Topic deleted successfully.");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete the topic.");
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Roadmap Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Learning Roadmap Overview</Text>
          <Text style={styles.overviewDescription}>{localRoadmap.roadmap_explanation}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{localRoadmap.topics.length}</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {/* {roadmap.topics.filter(topic => topic.topic_status === 'completed').length}% */}
              </Text>
              {/* <Text style={styles.statLabel}>Complete</Text> */}
            </View>
          </View>
        </View>
        
        {/* Topics List */}
        <Text style={styles.sectionTitle}>Learning Path</Text>
        
        {localRoadmap.topics.map((topic, index) => {
          const isExpanded = expandedTopics.includes(topic.topic_id);
          const isImportanceExpanded = expandedImportance === topic.topic_id;

          return (
            <View 
              key={topic.topic_id} 
              style={[
                styles.topicCard,
                index === localRoadmap.topics.length - 1 && styles.lastTopicCard
              ]}
            >
              <TouchableOpacity 
                style={styles.topicHeader} 
                onPress={() => toggleTopicExpansion(topic.topic_id)}
              >
                <View style={styles.topicTitleContainer}>
                  <View style={styles.topicNumber}>
                    <Text style={styles.topicNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.topicTitle}>{topic.name}</Text>
                </View>
                
                <View style={styles.topicActions}>
                  <TouchableOpacity 
                    onPress={() => handleStartEdit(topic)} 
                    style={styles.actionButton}
                  >
                    <FontAwesomeIcon icon={faEdit} size={16} color="#4C6EF5" />
                  </TouchableOpacity>
                  <FontAwesomeIcon 
                    icon={isExpanded ? faChevronUp : faChevronDown} 
                    size={16} 
                    color="#6B7280" 
                  />
                </View>
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.topicContent}>
                  <Text style={styles.contentLabel}>Description:</Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                  
                  {topic.subtopics.length > 0 && (
                    <>
                      <Text style={styles.contentLabel}>Subtopics:</Text>
                      <View style={styles.subtopicsContainer}>
                        {topic.subtopics.map((subtopic, subIdx) => (
                          <View key={subIdx} style={styles.subtopicItem}>
                        {/* //    <FontAwesomeIcon icon={faCheckCircle} size={14} color="#10B981" style={styles.bulletIcon} /> */}
                            <Text style={styles.subtopicText}>{subtopic}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                  
                  {!isImportanceExpanded ? (
                    <TouchableOpacity 
                      style={styles.importanceContainer}
                      onPress={() => toggleImportanceExpansion(topic.topic_id)}
                    >
                      <FontAwesomeIcon icon={faInfo} size={14} color="#6B7280" />
                      <Text style={styles.importanceText}>Why is this important?</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.importanceContainer}
                      onPress={() => toggleImportanceExpansion(topic.topic_id)}
                    >
                      <FontAwesomeIcon icon={faInfo} size={14} color="#6B7280" />
                      <Text style={styles.importanceText}>{topic.importance}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
        
        {/* Add Topic Button */}
        <TouchableOpacity style={styles.addTopicButton} onPress={handleAddTopic}>
          <FontAwesomeIcon icon={faPlus} size={20} color="#FFF" />
          <Text style={styles.addTopicText}>Add New Topic</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <RoadmapEditModal
        visible={editMode}
        editingTopic={editingTopic}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        onDelete={(topicId: number) => handleDeleteTopic(Number(topicId))}
        isAddingTopic={isAddingTopic}
      />
    </View>
  );
};

// Keep the existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  overviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  overviewDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  statsContainer: {
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center',       
    paddingBottom: 10 ,
    
  },
  statItem: {
    flex: 0,
    alignItems: 'center',
    
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4C6EF5',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  topicCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  lastTopicCard: {
    marginBottom: 80, // Provide space at the bottom
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  topicTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4C6EF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  topicActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginRight: 12,
  },
  topicContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 12,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  subtopicsContainer: {
    marginTop: 8,
  },
  subtopicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  subtopicText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  importanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  importanceText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  addTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4C6EF5',
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addTopicText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 6,
    marginRight: 12,
    color: '#F87171', 
  },
});

function setRoadmap(arg0: { topics: RoadmapTopic[]; status_code: number; message: string; roadmap_id: number; roadmap_explanation: string; }) {
  throw new Error('Function not implemented.');
}
function useAppDispatch() {
  throw new Error('Function not implemented.');
}

