import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FeedbackCardProps {
  topic_name: string;
  domain_name: string;
  mentor_name: string;
  feedback: string;
  onSummarize: () => void;
  onAnalyze: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  topic_name,
  domain_name,
  mentor_name,
  feedback,
  onSummarize,
  onAnalyze,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = feedback.length > 100;
  
  const displayedFeedback = shouldTruncate && !isExpanded 
    ? feedback.substring(0, 100) + '...' 
    : feedback;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.topicName}>{topic_name}</Text>
        <View style={styles.mentorInfo}>
          {/* <Text style={styles.domainName}>{domain_name}</Text> */}
          <Text style={styles.mentorName}> {mentor_name}</Text>
        </View>
      </View>
      
      <Text style={styles.feedbackText}>{displayedFeedback}</Text>
      
      {shouldTruncate && (
        <TouchableOpacity 
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.expandButton}
        >
          <Text style={styles.expandButtonText}>
            {isExpanded ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onSummarize}>
          <Text style={styles.buttonText}>Summarize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mentorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainName: {
    fontSize: 14,
    color: '#5474E8',
    fontWeight: '500',
  },
  mentorName: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  expandButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  expandButtonText: {
    color: '#5474E8',
    fontSize: 14,
    fontWeight: '500',
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
});

export default FeedbackCard;


