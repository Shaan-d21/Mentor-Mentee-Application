import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Button } from 'react-native';
import { RootStackParamList } from '../utils/navigation';

const { width, height } = Dimensions.get('window');

interface CustomDrawerContentProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const CustomDrawerContent = (props: CustomDrawerContentProps) => {
    const [drawerAnimation] = useState(new Animated.Value(0));
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
    const openDrawer = React.useCallback(() => {
      Animated.timing(drawerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [drawerAnimation]);
  
    const closeDrawer = React.useCallback(() => {
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [drawerAnimation]);
  
    const drawerTranslateX = drawerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-width * 0.8, 0],
    });
  
    React.useEffect(() => {
      if (props.isOpen) {
        openDrawer();
      } else {
        closeDrawer();
      }
    }, [props.isOpen, openDrawer, closeDrawer]);
  
    return (
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerTranslateX }] }]}>
        <TouchableOpacity style={styles.overlay} onPress={props.toggleDrawer} />
        <View style={styles.drawerContent}>
          <View style={styles.profileContainer}>
            <View style={[styles.profileIcon, { backgroundColor: 'gray' }]} />
            <Text style={styles.profileName}>John Doe</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('MentorDashboard')}
              title="Mentor Dashboard"
            />
          </View>
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('MenteeDashboard')}
              title="Mentee Dashboard"
            />
          </View>
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('ProfileScreen')}
              title="Profile"
            />
          </View>
          
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('MenteeProgress')}
              title="Mentee Progress"
            />
          </View>
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('EnrolledCoursesScreen')}
              title="Enrolled Courses"
            />
          </View>
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('FindMentorScreen')}
              title="Find Mentor"
            />
          </View>
          <View style={styles.menuItem}>
            <Button
              onPress={() => navigation.navigate('MenteeRequests')}
              title="Mentee Requests"
            />
          </View>
        </View>
      </Animated.View>
    );
  };
  
const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
    elevation: 4,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: 'white',
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default CustomDrawerContent;