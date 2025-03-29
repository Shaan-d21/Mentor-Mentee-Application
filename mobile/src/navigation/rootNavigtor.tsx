import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import SignInPage from "../screens/AuthScreens/SignInPage";
import CreateAccountPage from "../screens/AuthScreens/CreateAccountPage";
import { FC } from "react";
import MenteeDashboard from "../screens/Dashboards/mentee_dashboard";
import MentorDashboard from "../screens/Dashboards/mentor_dashboard";
import ProfileScreen from "../screens/profile/profile";
import MenteeRequests from "../screens/match_screens/menteerequest";

const Stack= createNativeStackNavigator<RootStackParamList>();
export const RootNavigator: FC= ()=>{
    return (
        <Stack.Navigator
            initialRouteName="CreateAccountPage"
            screenOptions={() => ({
                headerShown: false,
            })}
        >
            <Stack.Screen name="SignInPage" component={SignInPage} />
            <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} />
            <Stack.Screen name="MenteeDashboard" component={MenteeDashboard} />
            <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            
        </Stack.Navigator>
    );
}