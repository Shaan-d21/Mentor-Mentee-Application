import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Button } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { MMKV } from "react-native-mmkv";

const { width, height } = Dimensions.get("window");

interface CustomDrawerContentProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const CustomDrawerContent = (props: CustomDrawerContentProps) => {
  const storage = new MMKV();
  const [drawerAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = storage.getString("role") || null; 
    setUserRole(role); 
  }, []);
  
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

  useEffect(() => {
    if (props.isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [props.isOpen, openDrawer, closeDrawer]);

  // Logout function
  const handleLogout = () => {
    storage.delete("role"); // Clear role from storage
    storage.delete("token"); // Clear token if stored
    props.toggleDrawer(); // Close drawer
    navigation.navigate("SignInPage"); // Navigate to login page
  };

  return (
    <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerTranslateX }] }]}>
      <TouchableOpacity style={styles.overlay} onPress={props.toggleDrawer} />
      <View style={styles.drawerContent}>
        <View style={styles.profileContainer}>
          <View style={[styles.profileIcon, { backgroundColor: "gray" }]} />
          <Text style={styles.profileName}>John Doe</Text>
        </View>
        <View style={styles.separator} />

        {/* Conditional Navigation Based on Role */}
        {userRole === "mentee" && (
          <>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("MenteeDashboard")} title="Mentee Dashboard" />
            </View>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("MenteeProfileScreen")} title="Mentee Profile" />
            </View>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("FindMentorScreen")} title="Find Mentor" />
            </View>
          </>
        )}

        {userRole === "mentor" && (
          <>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("MentorDashboard")} title="Mentor Dashboard" />
            </View>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("MentorProfileScreen")} title="Mentor Profile" />
            </View>
            <View style={styles.menuItem}>
              <Button onPress={() => navigation.navigate("MenteeRequests")} title="Mentee Requests" />
            </View>
          </>
        )}

        {/* Logout Button */}
        <View style={styles.menuItem}>
          <Button onPress={handleLogout} title="Logout" />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
    elevation: 4,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContent: {
    width: width * 0.8,
    height: "100%",
    backgroundColor: "white",
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  menuItem: {
    paddingVertical: 12,
  },
});

export default CustomDrawerContent;
