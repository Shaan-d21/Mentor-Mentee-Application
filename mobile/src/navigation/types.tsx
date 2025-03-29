<<<<<<< HEAD:mobile/src/utils/navigation.ts
=======
import { createNavigationContainerRef } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

>>>>>>> 251b1e83389fa472b8a98a8d5c214a97fe3c36cd:mobile/src/navigation/types.tsx

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
<<<<<<< HEAD:mobile/src/utils/navigation.ts
    MenteeProfileScreen : undefined;
=======
};
>>>>>>> 251b1e83389fa472b8a98a8d5c214a97fe3c36cd:mobile/src/navigation/types.tsx

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;