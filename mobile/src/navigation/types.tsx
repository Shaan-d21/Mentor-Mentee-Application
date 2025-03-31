import { createNavigationContainerRef } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


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
    MenteeProfileScreen : undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;