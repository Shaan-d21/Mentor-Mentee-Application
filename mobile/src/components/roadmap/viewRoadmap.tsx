import React, { useState } from 'react';
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
    faChevronDown,
    faChevronUp,
    faInfo,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../redux/store'; // Import the hook
import { markTopicAsDone } from '../../redux/slices/sliceRoadmapTopics';
import { RoadmapResponse, RoadmapTopic } from '../../types/RoadmapTypes';

export const ViewListRoadmapItems = (props: { roadmap: RoadmapResponse | null }) => {
    const { roadmap } = props;

    // State for expanded/collapsed topics
    const [expandedTopics, setExpandedTopics] = useState<number[]>([]);

    const [expandedImportance, setExpandedImportance] = useState<number | null>(null);

    // Fix: Initialize as empty array, not null
    const [markingAsDone, setMarkingAsDone] = useState<number[]>([]);

    const dispatch = useAppDispatch(); // Use the hook

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

    const handleMarkAsDone = async (topicId: number) => {
        setMarkingAsDone([...markingAsDone, topicId]);
        try {
            await dispatch(markTopicAsDone({ topicId }));
        } catch (error) {
            console.error("Failed to mark topic as done:", error);
            Alert.alert("Error", "Failed to mark topic as done. Please try again.");
            // Remove from markingAsDone if the API call fails
            setMarkingAsDone(markingAsDone.filter(id => id !== topicId));
        }
    };

    // Helper to determine if a topic is marked or being marked
    const isMarkedOrMarking = (topic: RoadmapTopic): boolean => {
        return markingAsDone.includes(topic.topic_id) || topic.topic_status === 'marked';
    };
    const getTopicStatusIndicator = (topic: RoadmapTopic) => {
        if (topic.topic_status === 'completed') {
          return <View style={styles.statusIndicator}><Text style={styles.statusText}>Completed</Text></View>;
        } else if (topic.topic_status === 'marked' || markingAsDone.includes(topic.topic_id)) {
          return <></>
        } else if (topic.topic_status === 'reassigned') {
          return <View style={[styles.statusIndicator, styles.markedIndicator,{backgroundColor:"#EF4444"}]}><Text style={styles.statusText}>Reassigned</Text></View>;
        }
        return null;
      };
    return (
        (roadmap && roadmap.topics.length > 0) ? (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Roadmap Overview Card */}
                    <View style={styles.overviewCard}>
                        <Text style={styles.overviewTitle}>Learning Roadmap Overview</Text>
                        <Text style={styles.overviewDescription}>{roadmap.roadmap_explanation}</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{roadmap.topics.length}</Text>
                                <Text style={styles.statLabel}>Topics</Text>
                            </View>
                            <View style={styles.statItem}>
                            <Text style={styles.statValue}>
    {Math.round((roadmap.topics.filter(topic => topic.topic_status === 'completed').length / roadmap.topics.length) * 100)}%
</Text>
                                <Text style={styles.statLabel}>Complete</Text>
                            </View>
                        </View>
                    </View>

                    {/* Topics List */}
                    <Text style={styles.sectionTitle}>Learning Path</Text>

                    {roadmap.topics.map((topic, index) => {
                        const isExpanded = expandedTopics.includes(topic.topic_id);
                        const isImportanceExpanded = expandedImportance === topic.topic_id;
                        const isTopicMarked = isMarkedOrMarking(topic);

                        return (
                            <View
                                key={topic.topic_id}
                                style={[
                                    styles.topicCard,
                                    index === roadmap.topics.length - 1 && styles.lastTopicCard
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
                                        <View style={styles.topicTitleContainer}>
    {/* <View style={styles.topicNumber}>
        <Text style={styles.topicNumberText}>{index + 1}</Text>
    </View> */}
    <View style={{flex: 1}}>
        <Text style={styles.topicTitle}>{topic.name}</Text>
        {getTopicStatusIndicator(topic)}
    </View>
</View>
                                    </View>

                                    <View style={styles.topicActions}>
                                       
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
                                                            <FontAwesomeIcon icon={faCheckCircle} size={14} color="#10B981" style={styles.bulletIcon} />
                                                            <Text style={styles.subtopicText}>{subtopic}</Text>
                                                        </View>
                                                    ))}
                                                    
                                  
                                                </View>
                                            </>
                                        )}
                                                          {topic.topic_status !== 'completed' && (
                <TouchableOpacity
                    style={[
                        styles.doneButton,
                        isTopicMarked && styles.disabledButton
                    ]}
                    onPress={() => handleMarkAsDone(topic.topic_id)}
                    disabled={isTopicMarked}
                >
                    <Text style={{ color: 'white' }}>
                        {isTopicMarked ? "Requested..." : "Mark as Done"}
                    </Text>
                </TouchableOpacity>
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
                </ScrollView>
            </View>
        ) : (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No topics available</Text>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    // Add to the styles object
statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#10B981',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
},
markedIndicator: {
    backgroundColor: '#FBBF24',
},
statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
        flexDirection: 'row',
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    statItem: {
        flex: 1,
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
        marginBottom: 80,
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
    doneButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    disabledButton: {
        backgroundColor: '#94d3a2',  // Lighter green for disabled state
    }
});