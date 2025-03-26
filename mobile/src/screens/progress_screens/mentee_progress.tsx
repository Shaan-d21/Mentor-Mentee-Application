
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

interface Course {
  id: string;
  name: string;
  mentor: string;
  progress: number;
  modulesCompleted: string;
}

const courses: Course[] = [
  { id: '1', name: 'Course Name', mentor: 'Mentor Name', progress: 0.5, modulesCompleted: '12/25 Modules Completed' },
  { id: '2', name: 'Course Name', mentor: 'Mentor Name', progress: 0.75, modulesCompleted: '18/25 Modules Completed' },
  { id: '3', name: 'Course Name', mentor: 'Mentor Name', progress: 0.3, modulesCompleted: '8/25 Modules Completed' },
  { id: '4', name: 'Course Name', mentor: 'Mentor Name', progress: 0.9, modulesCompleted: '22/25 Modules Completed' },
];

const EnrolledCoursesScreen: React.FC = () => {
  const renderCourse = ({ item }: { item: Course }) => (
    <View style={styles.courseCard}>
      <View style={styles.courseDetails}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.mentorName}>{item.mentor}</Text>
        <Text style={styles.modulesCompleted}>{item.modulesCompleted}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressCircle, { borderColor: '#E0E0E0' }]} />
        <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Enrolled Courses</Text>
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  courseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  modulesCompleted: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnrolledCoursesScreen;
