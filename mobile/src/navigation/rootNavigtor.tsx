
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import SignInPage from '../screens/AuthScreens/SignInPage';
import CreateAccountPage from '../screens/AuthScreens/CreateAccountPage';
import { FC } from 'react';
import MenteeDashboard from '../screens/Dashboards/mentee_dashboard';
import MentorDashboard from '../screens/Dashboards/mentor_dashboard';
import MenteeProfileScreen from '../screens/profile/menteeProfile';
import MentorProfile from '../screens/profile/mentorprofile';
import CheckRequestScreen from '../screens/Dashboards/mentorcheckRequest';
import MenteeRoadmap from '../screens/CourseRoadmap/menteeRoadmap';

// import CustomDrawerContent from '../components/drawer_component';
import temp from '../screens/temp';
import { MentorRoadmapGeneration } from '../screens/CourseRoadmap/mentorRoadmapGenerationScreen';
import RoadmapScreen from '../screens/CourseRoadmap/viewRoadmap';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const RootNavigator: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignInPage"
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="SignInPage" component={SignInPage} />
      <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} />
      <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
      <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
      <Stack.Screen name="MentorProfileScreen" component={MentorProfile} />
      <Stack.Screen name="CheckRequestScreen" component={CheckRequestScreen} />
      <Stack.Screen name="MenteeRoadmap" component={MenteeRoadmap} />
      <Stack.Screen name="RoadmapScreen" component={RoadmapScreen} />
      <Stack.Screen name="MentorRoadmapGeneration" component={MentorRoadmapGeneration} />
      <Stack.Screen name="temp" component={temp} />
      {/* <Stack.Screen name="CustomDrawerContent" component={CustomDrawerContent} /> */}

      <Stack.Screen name="MenteeProfileScreen" component={MenteeProfileScreen} />
    </Stack.Navigator>
  );
};
