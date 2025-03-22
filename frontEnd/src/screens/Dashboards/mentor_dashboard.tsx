import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';

const MentorDashboard = () => {
  return (
    <View style={styles.container}>
      <AppBar title="Mentor Dashboard" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, Mentor 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>
        <Text style={styles.noRequestsText}>No requests at the moment</Text>
      
      <View style={styles.footer}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexGrow: 1,
    padding: 20,
  },
  noRequestsText: {
    textAlign: 'center',
    verticalAlign: 'middle',
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