import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';

const MentorDashboard = () => {
  return (
    <View style={styles.container}>
            <AppBar onProfilePress={()=>{}}openDrawer={()=>{}} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, Mentor 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.noRequestsText}>No requests at the moment</Text>
      </ScrollView>
      <View style={styles.footer}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the entire screen
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flexGrow: 1, // Allow content to grow within the ScrollView
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  noRequestsText: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default MentorDashboard;