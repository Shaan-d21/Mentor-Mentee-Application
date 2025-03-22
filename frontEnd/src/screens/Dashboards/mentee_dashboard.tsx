import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AppBar from '../../components/appbar_component';

const MenteeDashboard = () => {
  const courses = [
    { name: 'Course 1', Mentee: 'Mentor A', modulesCompleted: 3, totalModules: 24, daysRemaining: 10, color: '#e6f7ff' },
    { name: 'Course 2', Mentee: 'Mentor B', modulesCompleted: 5, totalModules: 24, daysRemaining: 15, color: '#f0e6ff' },
    { name: 'Course 3', Mentee: 'Mentor C', modulesCompleted: 8, totalModules: 24, daysRemaining: 20, color: '#ffe6f0' },
  ];

  return (
    <View style={styles.container}>
      <AppBar title="Mentee Dashboard" />
      <View style={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Courses"
          placeholderTextColor="#888"
        />
      </View>
      <Text style={styles.activeCoursesText}> Active Courses</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {courses.map((course, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: course.color }]}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.MenteeName}>Mentee: {course.Mentee}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.moduleText}>Module completed {course.modulesCompleted}/{course.totalModules}</Text>
              <Text style={styles.daysRemainingText}>{course.daysRemaining} Days remaining</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
    color: '#BDBDBD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  activeCoursesText: {
    fontSize: 18,
    color: '#757575',
    marginLeft: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding to the bottom of the scroll view
  },
  card: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  MenteeName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleText: {
    fontSize: 12,
    color: '#777',
  },
  daysRemainingText: {
    fontSize: 12,
    color: '#777',
  },
});

export default MenteeDashboard;