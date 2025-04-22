

// import React, { useState, useEffect } from 'react';
// import { summarizeFeedbackAPI, fetchMenteeFeedback, analyzeFeedbackAPI } from '../../services/apiFeedback/apiFeedbackMentee/apiFetchMenteeFeedback';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import AppBar from '../../components/appbar_component';
// import { RootStackParamList } from '../../navigation/types';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// interface Feedback {
//   mentee_id: number;
//   mentor_id: number;
//   domain_id: number;
//   feedback: string;
//   mentor_name: string;
//   domain_name: string;
//   feedback_id: number;
//   topic_name: string;
//   topic_id: number;
// }

// type Props = NativeStackScreenProps<RootStackParamList, 'MenteeFeedback'>;

// const MenteeFeedbackScreen: React.FC<Props> = ({ navigation }) => {
//   const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [summary, setSummary] = useState<string>('');
//   const [analysis, setAnalysis] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [modalContent, setModalContent] = useState<'summary' | 'analysis' | null>(null);

//   useEffect(() => {
//     const loadFeedback = async () => {
//       try {
//         const feedbackData = await fetchMenteeFeedback();
//         setFeedbackList(feedbackData);
//       } catch (error) {
//         console.error('Failed to load feedback:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFeedback();
//   }, []);

//   const summarizeFeedback = async (feedback: string) => {
//     try {
//       setLoading(true);
//       let summaryText = await summarizeFeedbackAPI(feedback);
//       summaryText = summaryText.replace(/\*/g, '').trim();
//       const bulletedSummary = summaryText
//         .split('\n')
//         .map(item => item.trim())
//         .filter(item => item !== '')
//         .map(item => `• ${item}`)
//         .join('\n');

//       setSummary(bulletedSummary);
//       setModalContent('summary');
//       setModalVisible(true);
//     } catch (error) {
//       console.error('Error summarizing feedback:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFeedback = async (menteeId: number, feedbackId: number) => {
//     try {
//       setLoading(true);
//       const analysisResponse = await analyzeFeedbackAPI(menteeId, feedbackId);
//       const { 'key takeaways': keyTakeaways, 'improvement areas': improvementAreas, 'action items': actionItems } = analysisResponse.data;

//       let formattedAnalysis = '';

//       if (keyTakeaways?.length) {
//         formattedAnalysis += 'Key Takeaways:\n';
//         formattedAnalysis += keyTakeaways.map(item => `• ${item}`).join('\n') + '\n\n';
//       }

//       if (improvementAreas?.length) {
//         formattedAnalysis += 'Improvement Areas:\n';
//         formattedAnalysis += improvementAreas.map(item => `• ${item}`).join('\n') + '\n\n';
//       }

//       if (actionItems?.length) {
//         formattedAnalysis += 'Action Items:\n';
//         formattedAnalysis += actionItems.map(item => `• ${item}`).join('\n');
//       }

//       setAnalysis(formattedAnalysis.trim());
//       setModalContent('analysis');
//       setModalVisible(true);
//     } catch (error) {
//       console.error('Error analyzing feedback:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderFeedbackCard = ({ item }: { item: Feedback }) => (
//     <View style={styles.feedbackCard}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.topicName}>{item.topic_name}</Text>
//         <View style={styles.mentorInfo}>
//           <Text style={styles.domainName}>{item.domain_name}</Text>
//           <Text style={styles.mentorName}>by {item.mentor_name}</Text>
//         </View>
//       </View>
//       <Text style={styles.feedbackText}>{item.feedback}</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={() => summarizeFeedback(item.feedback)}>
//           <Text style={styles.buttonText}>Summarize</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => analyzeFeedback(item.mentee_id, item.feedback_id)}>
//           <Text style={styles.buttonText}>Analyze</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <AppBar
//           onProfilePress={() => navigation.navigate('MenteeProfileScreen')}
//           openDrawer={() => {}}
//           title="Feedback"
//         />
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#5474E8" />
//           </View>
//         ) : (
//           <FlatList
//             data={feedbackList}
//             renderItem={renderFeedbackCard}
//             keyExtractor={(item) => item.feedback_id.toString()}
//             contentContainerStyle={styles.flatListContent}
//           />
//         )}
//       </View>

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>
//               {modalContent === 'summary' && (
//                 <>
//                   <Text style={styles.modalTitle}>Summary</Text>
//                   <Text style={styles.modalText}>{summary}</Text>
//                 </>
//               )}
//               {modalContent === 'analysis' && (
//                 <>
//                   <Text style={styles.modalTitle}>Analysis</Text>
//                   {analysis.split('\n\n').map((section, index) => {
//                     const [title, ...content] = section.split('\n');
//                     return (
//                       <View key={index} style={styles.analysisSection}>
//                         <Text style={styles.sectionTitle}>{title}</Text>
//                         <Text style={styles.modalText}>{content.join('\n')}</Text>
//                       </View>
//                     );
//                   })}
//                 </>
//               )}
//             </ScrollView>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeModal}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   cardHeader: {
//     marginBottom: 12,
//   },
//   topicName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   mentorInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   domainName: {
//     fontSize: 14,
//     color: '#5474E8',
//     fontWeight: '500',
//   },
//   mentorName: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontStyle: 'italic',
//   },
//   feedbackCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   feedbackText: {
//     fontSize: 14,
//     color: '#374151',
//     lineHeight: 22,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 12,
//   },
//   button: {
//     backgroundColor: '#5474E8',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     marginLeft: 8,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#111827',
//   },
//   modalText: {
//     fontSize: 15,
//     color: '#374151',
//     lineHeight: 22,
//   },
//   closeModal: {
//     marginTop: 20,
//     color: '#5474E8',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   analysisSection: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 8,
//   },
// });

// export default MenteeFeedbackScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import AppBar from '../../components/appbar_component';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { summarizeFeedbackAPI, fetchMenteeFeedback, analyzeFeedbackAPI } from '../../services/apiFeedback/apiFeedbackMentee/apiFetchMenteeFeedback';

interface Feedback {
  mentee_id: number;
  mentor_id: number;
  domain_id: number;
  feedback: string;
  mentor_name: string;
  domain_name: string;
  feedback_id: number;
  topic_name: string;
  topic_id: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'MenteeFeedback'>;

const MenteeFeedbackScreen: React.FC<Props> = ({ navigation }) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<'summary' | 'analysis' | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const feedbackData = await fetchMenteeFeedback();
      setFeedbackList(feedbackData);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const summarizeFeedback = async (feedback: string) => {
    try {
      setLoading(true);
      let summaryText = await summarizeFeedbackAPI(feedback);
      summaryText = summaryText.replace(/\*/g, '').trim();
      const bulletedSummary = summaryText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => `• ${item}`)
        .join('\n');

      setSummary(bulletedSummary);
      setModalContent('summary');
      setModalVisible(true);
    } catch (error) {
      console.error('Error summarizing feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFeedback = async (menteeId: number, feedbackId: number) => {
    try {
      setLoading(true);
      const analysisResponse = await analyzeFeedbackAPI(menteeId, feedbackId);
      const { 'key takeaways': keyTakeaways, 'improvement areas': improvementAreas, 'action items': actionItems } = analysisResponse.data;

      let formattedAnalysis = '';

      if (keyTakeaways?.length) {
        formattedAnalysis += 'Key Takeaways:\n';
        formattedAnalysis += keyTakeaways.map(item => `• ${item}`).join('\n') + '\n\n';
      }

      if (improvementAreas?.length) {
        formattedAnalysis += 'Improvement Areas:\n';
        formattedAnalysis += improvementAreas.map(item => `• ${item}`).join('\n') + '\n\n';
      }

      if (actionItems?.length) {
        formattedAnalysis += 'Action Items:\n';
        formattedAnalysis += actionItems.map(item => `• ${item}`).join('\n');
      }

      setAnalysis(formattedAnalysis.trim());
      setModalContent('analysis');
      setModalVisible(true);
    } catch (error) {
      console.error('Error analyzing feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedFeedback = feedbackList.reduce((acc: { [key: string]: Feedback[] }, item) => {
    if (!acc[item.domain_name]) {
      acc[item.domain_name] = [];
    }
    acc[item.domain_name].push(item);
    return acc;
  }, {});

  const renderDomainSection = ({ item: domainName }: { item: string }) => (
    <View style={styles.domainSection}>
      <TouchableOpacity 
        style={styles.domainHeader}
        onPress={() => setExpandedDomain(expandedDomain === domainName ? null : domainName)}
      >
        <Text style={styles.domainTitle}>{domainName}</Text>
        <FontAwesomeIcon 
          icon={expandedDomain === domainName ? faChevronUp : faChevronDown} 
          size={20} 
          color="#6B7280" 
        />
      </TouchableOpacity>
      
      {expandedDomain === domainName && (
        <View style={styles.feedbackList}>
          {groupedFeedback[domainName].map((feedback) => (
            <FeedbackCard
              key={feedback.feedback_id}
              topic_name={feedback.topic_name}
              domain_name={feedback.domain_name}
              mentor_name={feedback.mentor_name}
              feedback={feedback.feedback}
              onSummarize={() => summarizeFeedback(feedback.feedback)}
              onAnalyze={() => analyzeFeedback(feedback.mentee_id, feedback.feedback_id)}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppBar
          onProfilePress={() => navigation.navigate('MenteeProfileScreen')}
          openDrawer={() => {}}
          title="Feedback"
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5474E8" />
          </View>
        ) : (
          <FlatList
            data={Object.keys(groupedFeedback)}
            renderItem={renderDomainSection}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.flatListContent}
          />
        )}

        <Modal 
          visible={modalVisible} 
          transparent 
          animationType="fade" 
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {modalContent === 'summary' && (
                  <>
                    <Text style={styles.modalTitle}>Summary</Text>
                    <Text style={styles.modalText}>{summary}</Text>
                  </>
                )}
                {modalContent === 'analysis' && (
                  <>
                    <Text style={styles.modalTitle}>Analysis</Text>
                    {analysis.split('\n\n').map((section, index) => {
                      const [title, ...content] = section.split('\n');
                      return (
                        <View key={index} style={styles.analysisSection}>
                          <Text style={styles.sectionTitle}>{title}</Text>
                          <Text style={styles.modalText}>{content.join('\n')}</Text>
                        </View>
                      );
                    })}
                  </>
                )}
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    padding: 16,
  },
  domainSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  domainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  feedbackList: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  analysisSection: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeButtonText: {
    color: '#5474E8',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenteeFeedbackScreen;