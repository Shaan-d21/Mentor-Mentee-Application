import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AppBar from '../../components/appbar_component';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchCheckReport} from '../../redux/slices/SliceCheckReport';

type CheckReportNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CheckReport'
>;
const CheckReport = ({route}: any) => {
  const {mentorId, domain, score} = route.params; // Get mentorId from navigation params
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<CheckReportNavigationProp>();
  const {data, status, error} = useSelector(
    (state: RootState) => state.checkReport,
  );

  useEffect(() => {
    // Fetch the report data when the screen is mounted
    console.log(mentorId, domain, score);
    dispatch(fetchCheckReport({mentorId, domain, score}));
  }, [dispatch, mentorId, domain, score]);

  // Reset the state when the screen is unmounted

  const getTintColor = (score: number) => {
    if (score < 30) return '#f44336'; // Red
    if (score < 70) return '#ffb300'; // Amber
    return '#81c784'; // Green
  };

  if (status === 'loading') {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#2196F3" />
    );
  }

  if (status === 'failed') {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!data) {
    return <Text style={styles.loading}>No data available</Text>;
  }

  return (
    <View style={{flex: 1}}>
      <AppBar
        title="Report"
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}
        openDrawer={() => {}}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Compatibility Score</Text>

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

        <Text style={styles.score}>{score}% Compatible</Text>

        <Text style={styles.section}>Mentor's Skills</Text>
        {data.existingSkills.length > 0 && (
          <>
            <Text style={styles.subSection}>Existing Skills</Text>
            <View style={styles.skillContainer}>
              {data.existingSkills.map((skill, index) => (
                <Text key={index} style={styles.skillGreen}>
                  {skill}
                </Text>
              ))}
            </View>
          </>
        )}

        {data.missingSkills.length > 0 && (
          <>
            <Text style={styles.subSection}>Missing Skills</Text>
            <View style={styles.skillContainer}>
              {data.missingSkills.map((skill, index) => (
                <Text key={index} style={styles.skillRed}>
                  {skill}
                </Text>
              ))}
            </View>
          </>
        )}

        <Text style={styles.section}>Summary of the Report</Text>
        <Text style={styles.summary}>{data.summary}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5', // light gray background
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A237E',
    textAlign: 'center',
    marginVertical: 12,
  },
  noSkillsText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
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
  subSection: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: 'rgb(64, 120, 224)',
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  skillGreen: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 6,
    color: '#fff',
    fontWeight: '600',
    elevation: 2,
  },
  skillRed: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 6,
    color: '#fff',
    fontWeight: '600',
    elevation: 2,
  },
  summary: {
    fontSize: 15,
    color: 'rgba(109, 93, 3, 0.72)', // Bright yellow text
    backgroundColor: 'rgba(0,0,255,0.2)', // Blue background
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
    lineHeight: 22,
    fontWeight: '800',
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
});

export default CheckReport;
