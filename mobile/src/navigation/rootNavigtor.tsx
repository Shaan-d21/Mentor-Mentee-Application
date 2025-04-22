import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import SignInPage from '../screens/AuthScreens/SignInPage';
import CreateAccountPage from '../screens/AuthScreens/CreateAccountPage';
import {FC} from 'react';
import MenteeDashboard from '../screens/Dashboards/mentee_dashboard';
import MentorDashboard from '../screens/Dashboards/mentor_dashboard';
import MenteeProfileScreen from '../screens/profile/menteeProfile';
import MentorProfile from '../screens/profile/mentorprofile';
import CheckRequestScreen from '../screens/Dashboards/mentorcheckRequest';
import MenteeRoadmap from '../screens/CourseRoadmap/menteeRoadmap';
import checkReport from '../screens/Check_Report/checkreport';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Added AsyncStorage

// import CustomDrawerContent from '../components/drawer_component';
import temp from '../screens/temp';
import {MentorRoadmapGeneration} from '../screens/CourseRoadmap/mentorRoadmapGenerationScreen';
import CheckCompatibility from '../screens/Dashboards/checkCompatibilty';
import RoadmapScreen from '../screens/CourseRoadmap/RoadmapScreen';
import MenteeRequests from '../screens/Dashboards/mentee_requests';
import MentorProgress from '../screens/progress_screens/mentor_progress';
import MenteeFeedback from '../screens/Feedback/menteeFeedback';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/auth/sliceLogin';
import { AppDispatch } from '../redux/store';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const RootNavigator: FC = () => {
  const dispatch= useDispatch<AppDispatch>();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('SignInPage');

  useEffect(() => {
    const checkRememberMe = async () => {
      const remembered = await AsyncStorage.getItem('rememberMe');
      if (remembered === 'true') {
        // If "Remember Me" is true, check the user role and navigate accordingly
        const userRole = await AsyncStorage.getItem('userRole'); // Assuming you saved the role in AsyncStorage
        if (userRole === 'mentor') {
          setInitialRoute('MentorDashboard'); // If the role is 'mentor', navigate to MentorDashboard
        } else {
          setInitialRoute('MenteeDashboard'); // Otherwise, navigate to MenteeDashboard
        }

        const email = (await AsyncStorage.getItem('email')) || '';
        const password = (await AsyncStorage.getItem('password')) || '';
        // console.log("Email is", email);
        // console.log("Password is", password);
        
        dispatch(loginUser({ email: email, password: password }));

        // console.log("Email is ", AsyncStorage.getItem('email').toString());
        // console.log("Password is ", AsyncStorage.getItem('password'));
      } else {
        setInitialRoute('SignInPage'); // If "Remember Me" is false, navigate to SignInPage
      }
    };

    checkRememberMe(); // ✅ Check for RememberMe status when the component mounts
  }, []); 
  return (
    <Stack.Navigator
      initialRouteName={initialRoute} 
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
      <Stack.Screen
        name="MentorRoadmapGeneration"
        component={MentorRoadmapGeneration}
      />
      <Stack.Screen name="CheckCompatibility" component={CheckCompatibility} />
      <Stack.Screen name="temp" component={temp} />
      <Stack.Screen name="MenteeRequests" component={MenteeRequests} />
      <Stack.Screen name="MentorProgress" component={MentorProgress} />
      <Stack.Screen name="MenteeFeedback" component={MenteeFeedback} />

      {/* <Stack.Screen name="CustomDrawerContent" component={CustomDrawerContent} /> */}
      <Stack.Screen name="CheckReport" component={checkReport} />
      <Stack.Screen
        name="MenteeProfileScreen"
        component={MenteeProfileScreen}
      />
    </Stack.Navigator>
  );
};
