import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AppBar from '../../components/appbar_component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { AppDispatch, RootState } from '../../redux/store';

import { fetchCheckReport } from '../../redux/slices/SliceCheckReport';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons';

type CheckReportNavigationProp = StackNavigationProp<RootStackParamList, 'CheckReport'>;

const CheckReport = ({ route }: any) => {
  const { mentorId, domain, score } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<CheckReportNavigationProp>();
  const { data, status, error } = useSelector((state: RootState) => state.checkReport);

  useEffect(() => {
    dispatch(fetchCheckReport({ mentorId, domain, score }));
  }, [dispatch, mentorId, domain, score]);

  const getTintColor = (score: number) => {
    if (score < 30) return '#f44336';
    if (score < 70) return '#ffb300';
    return '#81c784';
  };

  if (status === 'loading') {
    return <ActivityIndicator style={styles.loading} size="large" color="#2196F3" />;
  }

  if (status === 'failed') {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!data) {
    return <Text style={styles.loading}>No data available</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
          <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={24} color="#1A237E" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>Mentor Compatibility Report</Text>
  </View>
    </View>
      {/* <AppBar
        title="Report"
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}

      /> */}
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Score</Text>

        <View style={styles.meter}>
          <AnimatedCircularProgress
            size={140}
            width={15}
            fill={score}
            tintColor={getTintColor(score)}
            backgroundWidth={15}
            backgroundColor="#e0e0e0"
            rotation={0}
            lineCap="round"
            duration={1000}>
            {(fill: number) => (
              <Text style={styles.scoreInside}>{`${Math.round(fill)}%`}</Text>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* <Text style={styles.score}>{score}% Compatible</Text> */}

        <Text style={styles.section}>Skillset Analysis</Text>
        
        {data.existingSkills.length > 0 && (
          <View style={styles.skillSection}>
            <Text style={styles.subSection}>Existing Skills</Text>
            <View style={styles.existingSkillsCard}>
              <View style={styles.skillContainer}>
                {data.existingSkills.map((skill, index) => (
                  <Text key={index} style={styles.skillPillExisting}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {data.missingSkills.length > 0 && (
          <View style={styles.skillSection}>
            <Text style={styles.subSection}>Missing Skills</Text>
            <View style={styles.missingSkillsCard}>
              <View style={styles.skillContainer}>
                {data.missingSkills.map((skill, index) => (
                  <Text key={index} style={styles.skillPillMissing}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryHeaderText}>Compatibility Summary</Text>
          </View>
          <View style={styles.summaryContainer}>
            {Array.isArray(data.summary) ? (
              data.summary.map((point, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.summaryText}>{point}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.summaryText}>{data.summary}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A237E',
    textAlign: 'center',
    marginVertical: 12,
  },
  meter: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  scoreInside: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgb(64, 120, 224)',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 30,
    color: '#1A237E',
  },
  skillSection: {
    marginTop: 16,
  },
  subSection: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: 'rgb(64, 120, 224)',
  },
  existingSkillsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
  },
  missingSkillsCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPillMissing: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    color: 'red',
    fontWeight: '600',
    elevation: 1,
    borderColor:'red',
    borderWidth: 1,
  },
  skillPillExisting: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    color: 'green',
    fontWeight: '600',
    elevation: 1,
    borderColor:'green',
    borderWidth: 1,
  },
  summarySection: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  summaryHeader: {
    backgroundColor: '#1A237E',
    padding: 16,
  },
  summaryHeaderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 15,
    color: '#1A237E',
    marginRight: 8,
    fontWeight: '600',
    lineHeight: 22,
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 22,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  backButton: {
    
    position: 'relative',
    zIndex: 1,
    left: 0,
    
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A237E',
    
    
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
});

export default CheckReport;