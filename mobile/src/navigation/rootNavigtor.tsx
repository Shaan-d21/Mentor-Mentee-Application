import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import SignInPage from "../screens/AuthScreens/SignInPage";
import CreateAccountPage from "../screens/AuthScreens/CreateAccountPage";
import MenteeDashboard from "../screens/Dashboards/mentee_dashboard";
import MentorDashboard from "../screens/Dashboards/mentor_dashboard";
import MenteeProfileScreen from "../screens/profile/screenmenteeprofile";
import MentorProfile from "../screens/profile/mentorprofile";
import { MMKV } from "react-native-mmkv";
import React, { useEffect, useState } from "react";

const storage = new MMKV();
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = storage.getString("role") || null;
    setUserRole(role);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="SignInPage"
      screenOptions={{ headerShown: false }}
    >
      {/* Common Screens */}
      <Stack.Screen name="SignInPage" component={SignInPage} />
      <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} />

      {/* Mentee Screens */}
          <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
          <Stack.Screen name="MenteeProfileScreen" component={MenteeProfileScreen} />


      {/* Mentor Screens */}
          <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
          <Stack.Screen name="MentorProfileScreen" component={MentorProfile} />
    </Stack.Navigator>
  );
};
