import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignInPage: undefined;
  CreateAccountPage: undefined;
  MenteeDashboard: undefined;
  MentorDashboard: undefined;
  ProfileScreen: undefined;
  MenteeProgress: undefined;
  EnrolledCoursesScreen: undefined;
  FindMentorScreen: undefined;
  MenteeRequests: undefined;
  MentorProfileScreen: undefined;
  MenteeRoadmap: undefined;
  CheckRequestScreen: undefined;
  MenteeProfileScreen: undefined;
  CheckCompatibility:undefined;
  MentorRoadmapGeneration: undefined;
  temp: undefined;
  viewRoadmap: undefined;
  generateRoadmap: undefined;
  MenteeFeedback: undefined;

  RoadmapScreen: {
    roadmap_id: number;
  };

};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
