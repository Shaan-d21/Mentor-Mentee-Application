import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal,
  TextInput,
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faTrash, 
  faPlus, 
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { RoadmapTopic } from '../../types/RoadmapTypes';
import { apiDeleteTopic } from '../../services/apiRoadmap/apiGenerateRoadmapMentor';

interface RoadmapEditModalProps {
  visible: boolean;
  editingTopic: RoadmapTopic | null;
  onCancel: () => void;
  onSave: (editedTopic: RoadmapTopic) => void;
  onDelete: (topicId: number) => void;
  isAddingTopic?: boolean;
}

const RoadmapEditModal: React.FC<RoadmapEditModalProps> = ({ 
  visible, 
  editingTopic, 
  onCancel, 
  onSave,
  onDelete,
  isAddingTopic = false
}) => {
  const [editedValues, setEditedValues] = useState<any>({
    name: '',
    description: '',
    subtopics: [],
    importance: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Initialize form values when editingTopic changes
  useEffect(() => {
    if (editingTopic) {
      setEditedValues({
        name: editingTopic.name,
        description: editingTopic.description,
        subtopics: [...editingTopic.subtopics],
        importance: editingTopic.importance
      });
      setErrors({});
    }
  }, [editingTopic]);

  // Update a subtopic text
  const updateSubtopic = (index: number, text: string) => {
    const updatedSubtopics = [...editedValues.subtopics];
    updatedSubtopics[index] = text;
    setEditedValues({...editedValues, subtopics: updatedSubtopics});
  };
  
  // Add a new subtopic
  const addSubtopic = () => {
    setEditedValues({
      ...editedValues, 
      subtopics: [...editedValues.subtopics, ""]
    });
  };
  
  // Delete a subtopic
  const deleteSubtopic = (index: number) => {
    const updatedSubtopics = editedValues.subtopics.filter((_: any, i: number) => i !== index);
    setEditedValues({...editedValues, subtopics: updatedSubtopics});
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!editedValues.name.trim()) {
      newErrors.name = "Topic name is required";
    }
    
    if (!editedValues.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!editedValues.importance.trim()) {
      newErrors.importance = "Importance is required";
    }
    
    if (editedValues.subtopics.length === 0) {
      newErrors.subtopics = "At least one subtopic is required";
    } else {
      const emptySubtopics = editedValues.subtopics.filter((st: string) => !st.trim());
      if (emptySubtopics.length > 0) {
        newErrors.subtopics = "Subtopics cannot be empty";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async() => {
    if (!validateForm()) {
      return;
    }
    
    if (editingTopic) {
      setIsSaving(true);
      try {
        await onSave({
          ...editingTopic,
          name: editedValues.name.trim(),
          description: editedValues.description.trim(),
          subtopics: editedValues.subtopics.map((st: string) => st.trim()),
          importance: editedValues.importance.trim()
        });
      } finally {
        setIsSaving(false);
      }
    }
  };


 

    // const handleDeleteTopic = async (topicId: number) => {
    //   const result = await apiDeleteTopic(topicId);
    //   if (result.success) {
    //     // Remove it from the UI list
    //     setTopics((prev) => prev.filter((t: { topic_id: number; }) => t.topic_id !== topicId));
    //   } else {
    //     console.log("Failed to delete topic", result);
    //     Alert.alert("Error", "Could not delete topic.");
    //   }
    // };

    useEffect(() => {
      const hardcodedTopicId =  4743; // Replace with your topic ID
      apiDeleteTopic(hardcodedTopicId)
        .then(() => {
          console.log("Topic deleted successfully");
        })
        .catch((error) => {
          console.error("Failed to delete topic:", error);
        });
    }, []);
    
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>
              {isAddingTopic ? "Add New Topic" : "Edit Topic"}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.editModalBody}>
            <Text style={styles.editLabel}>Topic Name</Text>
            <TextInput
              style={[styles.editInput, errors.name ? styles.inputError : null]}
              value={editedValues.name}
              onChangeText={(text) => setEditedValues({...editedValues, name: text})}
              placeholder="Topic name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            
            <Text style={styles.editLabel}>Description</Text>
            <TextInput
              style={[styles.editInput, styles.multilineInput, errors.description ? styles.inputError : null]}
              value={editedValues.description}
              onChangeText={(text) => setEditedValues({...editedValues, description: text})}
              placeholder="Topic description"
              multiline
              numberOfLines={3}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            
            <Text style={styles.editLabel}>Importance</Text>
            <TextInput
              style={[styles.editInput, styles.multilineInput, errors.importance ? styles.inputError : null]}
              value={editedValues.importance}
              onChangeText={(text) => setEditedValues({...editedValues, importance: text})}
              placeholder="Why is this topic important?"
              multiline
              numberOfLines={3}
            />
            {errors.importance && <Text style={styles.errorText}>{errors.importance}</Text>}
            
            <Text style={styles.editLabel}>Subtopics</Text>
            {errors.subtopics && <Text style={styles.errorText}>{errors.subtopics}</Text>}
            
            {editedValues.subtopics.map((subtopic: string, idx: number) => (
              <View key={idx} style={styles.editSubtopicRow}>
                <TextInput
                  style={[styles.editSubtopicInput, errors.subtopics ? styles.inputError : null]}
                  value={subtopic}
                  onChangeText={(text) => updateSubtopic(idx, text)}
                  placeholder="Subtopic"
                />
                {editedValues.subtopics.length > 1 && (
                  <TouchableOpacity onPress={() => deleteSubtopic(idx)}>
                    <FontAwesomeIcon icon={faTrash} size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.addSubtopicButton} onPress={addSubtopic}>
              <FontAwesomeIcon icon={faPlus} size={16} color="#4C6EF5" />
              <Text style={styles.addSubtopicText}>Add Subtopic</Text>
            </TouchableOpacity>
          </ScrollView>
          
          <View style={styles.editModalFooter}>
            {!isAddingTopic && editingTopic && (
              <TouchableOpacity 
                style={[styles.editModalButton, styles.deleteButton]} 
                onPress={() => onDelete(Number(editingTopic.topic_id))}
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faTrash} size={16} color="#FFF" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.editModalButton, styles.cancelButton]} 
              onPress={onCancel}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editModalButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} size={16} color="#FFF" />
                  <Text style={styles.saveButtonText}>
                    {isAddingTopic ? "Add Topic" : "Save Changes"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  editModalBody: {
    padding: 16,
    maxHeight: 400,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 12,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editSubtopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editSubtopicInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  addSubtopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  addSubtopicText: {
    color: '#4C6EF5',
    fontSize: 14,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  editModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  editModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4C6EF5',
    flexDirection: 'row',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default RoadmapEditModal;

function setTopics(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
