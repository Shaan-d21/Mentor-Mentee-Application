
// import React, { useState, useEffect } from 'react';
// import { summarizeFeedbackAPI } from '../../services/apiFeedback/apiFetchMenteeFeedback';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   Modal,
// } from 'react-native';
// import { fetchMenteeFeedback } from '../../services/apiFeedback/apiFetchMenteeFeedback';
// import AppBar from '../../components/appbar_component';

// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
// import { RootStackParamList } from '../../navigation/types';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { analyzeFeedbackAPI } from '../../services/apiFeedback/apiFetchMenteeFeedback';


// interface Feedback {
//   mentee_id: number;
//   mentor_id: number;
//   domain_id: number;
//   feedback: string;
//   mentor_name: string;
//   domain_name: string;
//   feedback_id:number;
// }


// type Props = NativeStackScreenProps<RootStackParamList, 'MenteeFeedback'>;

// const MenteeFeedbackScreen: React.FC<Props> = ({ navigation }) => {
//   const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
//   const [expandedDomainName, setExpandedDomainName] = useState<string | null>(null);
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
//         // Handle error appropriately
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFeedback();
//   }, []);

//   const toggleExpand = (domain_name: string) => {
//     setExpandedDomainName(expandedDomainName === domain_name ? null : domain_name);
//   };

//   const summarizeFeedback = async (feedback: string) => {
//     try {
//       setLoading(true);
//       console.log('Summarizing feedback:', feedback);
//       let summaryText = await summarizeFeedbackAPI(feedback);
//       console.log('Summary:', summaryText);
//       summaryText = summaryText.replace(/\*/g, '').trim();
//       const bulletedSummary = summaryText
//       .split('\n')
//       .map(item => item.trim())
//       .filter(item => item !== '') // Remove empty lines
//       .map(item => `\u2022 ${item}`) // Add bullet point
//       .join('\n');

//       setSummary(bulletedSummary);
//       setModalContent('summary');
//       setModalVisible(true);
//     } catch (error) {
//       // Optionally show a Toast or error modal
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFeedback = async (menteeId: number, feedbackId: number) => {
//     try {
//       setLoading(true);
//       const analysisResponse = await analyzeFeedbackAPI(menteeId, feedbackId);
//       console.log('Analysis Response:', analysisResponse);

//       // Format the analysis data
//       const { "key takeaways": keyTakeaways, "improvement areas": improvementAreas, "action items": actionItems } = analysisResponse.data;

//       let formattedAnalysis = '';

//       if (keyTakeaways && keyTakeaways.length > 0) {
//         formattedAnalysis += "Key Takeaways:\n";
//         formattedAnalysis += keyTakeaways.map(item => `\u2022 ${item}`).join('\n') + '\n\n';
//       }

//       if (improvementAreas && improvementAreas.length > 0) {
//         formattedAnalysis += "Improvement Areas:\n";
//         formattedAnalysis += improvementAreas.map(item => `\u2022 ${item}`).join('\n') + '\n\n';
//       }

//       if (actionItems && actionItems.length > 0) {
//         formattedAnalysis += "Action Items:\n";
//         formattedAnalysis += actionItems.map(item => `\u2022 ${item}`).join('\n');
//       }

//       setAnalysis(formattedAnalysis);
//       setModalContent('analysis');
//       setModalVisible(true);

//     } catch (error) {
//       console.error('Error analyzing feedback:', error);
//       // Optionally show a Toast or error modal
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group feedback by domain name
//   const groupedFeedback = feedbackList.reduce((acc: { [key: string]: Feedback[] }, item: Feedback) => {
//     const domainName = item.domain_name;
//     if (!acc[domainName]) {
//       acc[domainName] = [];
//     }
//     acc[domainName].push(item);
//     return acc;
//   }, {});

//   const renderFeedbackCard = (item: Feedback) => (
//     <View style={styles.feedbackCard}>
//       <Text style={styles.mentorName}>{item.mentor_name}</Text>
//       <Text style={styles.feedbackText}>{item.feedback}</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => summarizeFeedback(item.feedback)}
//         >
//           <Text style={styles.buttonText}>Summarize</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => analyzeFeedback(item.mentee_id,item.feedback_id)}
//         >
//           <Text style={styles.buttonText}>Analyze</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderDomainSection = ({ item }: { item: string }) => (
//     <View style={styles.domainSection}>
//       <TouchableOpacity style={styles.domainHeader} onPress={() => toggleExpand(item)}>
//         <Text style={styles.domainName}>{item}</Text>
//         <FontAwesomeIcon
//           icon={expandedDomainName === item ? faChevronUp : faChevronDown}
//           size={20}
//           color="#6B7280"
//         />
//       </TouchableOpacity>
//       {expandedDomainName === item && (
//         <View style={styles.feedbackListContainer}>
//           {groupedFeedback[item].map((feedbackItem) => (
//             <View key={feedbackItem.mentee_id} >
//               {renderFeedbackCard(feedbackItem)}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <AppBar
//           onProfilePress={() => { navigation.navigate('MenteeProfileScreen'); }}
//           openDrawer={() => { }}
//           title="Feedback"
//         />
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#5474E8" />
//           </View>
//         ) : (
//           <FlatList
//             data={Object.keys(groupedFeedback)}
//             renderItem={renderDomainSection}
//             keyExtractor={(item) => item}
//             contentContainerStyle={styles.flatListContent}
//           />
//         )}
//       </View>

//       {/* Modal to display Summary */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {modalContent === 'summary' && (
//               <View>
//                 <Text style={styles.modalTitle}>Summary</Text>
//                 <Text>{summary}</Text>
//               </View>
//             )}
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeModal}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
      
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {modalContent === 'summary' && (
//               <View>
//                 <Text style={styles.modalTitle}>Summary</Text>
//                 <Text>{summary}</Text>
//               </View>
//             )}
//             {modalContent === 'analysis' && (
//               <View>
//                 <Text style={styles.modalTitle}>Analysis</Text>
//                 <Text>{analysis}</Text>
//               </View>
//             )}
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
//     backgroundColor: '#F9FAFB', // Light background color
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   domainSection: {
//     marginBottom: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     overflow: 'hidden',
//   },
//   domainHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   domainName: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#374151', // Darker text color
//   },
//   feedbackListContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   feedbackCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   mentorName: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#4B5563',
//     marginBottom: 8,
//   },
//   feedbackText: {
//     fontSize: 14,
//     color: '#6B7280',
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
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalContent: {
//     backgroundColor: '#FFF',
//     padding: 20,
//     borderRadius: 8,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   closeModal: {
//     color: '#5474E8',
//     marginTop: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default MenteeFeedbackScreen;
import React, { useState, useEffect } from 'react';
import { summarizeFeedbackAPI, fetchMenteeFeedback, analyzeFeedbackAPI } from '../../services/apiFeedback/apiFetchMenteeFeedback';
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
import AppBar from '../../components/appbar_component';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface Feedback {
  mentee_id: number;
  mentor_id: number;
  domain_id: number;
  feedback: string;
  mentor_name: string;
  domain_name: string;
  feedback_id: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'MenteeFeedback'>;

const MenteeFeedbackScreen: React.FC<Props> = ({ navigation }) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [expandedDomainName, setExpandedDomainName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<'summary' | 'analysis' | null>(null);

  useEffect(() => {
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

    loadFeedback();
  }, []);

  const toggleExpand = (domain_name: string) => {
    setExpandedDomainName(expandedDomainName === domain_name ? null : domain_name);
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

  const groupedFeedback = feedbackList.reduce((acc: { [key: string]: Feedback[] }, item: Feedback) => {
    const domainName = item.domain_name;
    if (!acc[domainName]) acc[domainName] = [];
    acc[domainName].push(item);
    return acc;
  }, {});

  const renderFeedbackCard = (item: Feedback) => (
    <View style={styles.feedbackCard}>
      <Text style={styles.mentorName}>{item.mentor_name}</Text>
      <Text style={styles.feedbackText}>{item.feedback}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => summarizeFeedback(item.feedback)}>
          <Text style={styles.buttonText}>Summarize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => analyzeFeedback(item.mentee_id, item.feedback_id)}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDomainSection = ({ item }: { item: string }) => (
    <View style={styles.domainSection}>
      <TouchableOpacity style={styles.domainHeader} onPress={() => toggleExpand(item)}>
        <Text style={styles.domainName}>{item}</Text>
        <FontAwesomeIcon icon={expandedDomainName === item ? faChevronUp : faChevronDown} size={20} color="#6B7280" />
      </TouchableOpacity>
      {expandedDomainName === item && (
        <View style={styles.feedbackListContainer}>
          {groupedFeedback[item].map((feedbackItem) => (
            <View key={feedbackItem.feedback_id}>
              {renderFeedbackCard(feedbackItem)}
            </View>
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
      </View>

      {/* Modal for Summary and Analysis */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
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
                  <Text style={styles.modalText}>{analysis}</Text>
                </>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
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
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
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
  },
  domainName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },
  feedbackListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  mentorName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#5474E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  modalText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  closeModal: {
    marginTop: 20,
    color: '#5474E8',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MenteeFeedbackScreen;

