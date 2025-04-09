// import { CommonActions, useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Animated,
//   Button,
// } from "react-native";
// import { RootStackParamList } from "../navigation/types";
// import { MMKV } from "react-native-mmkv";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/slices/sliceLogin";
// import { RootState } from "../redux/store";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

// const { width, height } = Dimensions.get("window");

// interface CustomDrawerContentProps {
//   isOpen: boolean;
//   toggleDrawer: () => void;
// }

// const CustomDrawerContent = (props: CustomDrawerContentProps) => {
//   const userName= useSelector((state:RootState)=> state.login.name);
//   const dispatch = useDispatch();
//   const storage = new MMKV();
//   const [drawerAnimation] = useState(new Animated.Value(0));
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     const role = storage.getString("role") || null;
//     setUserRole(role);
//   }, []);

//   const openDrawer = React.useCallback(() => {
//     Animated.timing(drawerAnimation, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [drawerAnimation]);

//   const closeDrawer = React.useCallback(() => {
//     Animated.timing(drawerAnimation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [drawerAnimation]);

//   const drawerTranslateX = drawerAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-width * 0.8, 0],
//   });

//   const overlayOpacity = drawerAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 0.5],
//   });

//   useEffect(() => {
//     if (props.isOpen) {
//       openDrawer();
//     } else {
//       closeDrawer();
//     }
//   }, [props.isOpen, openDrawer, closeDrawer]);

//   const handleLogout = () => {
//     dispatch(logout());
//     storage.delete("role");
//     storage.delete("token");
//     props.toggleDrawer();
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: 'SignInPage' }], // Replace with your login screen name
//       }))
//     // navigation.navigate("SignInPage");
//   };

//   return (
//     <>
//       {/* Animated Overlay */}
//       <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
//         <TouchableOpacity style={{ flex: 1 }} onPress={props.toggleDrawer} />
//       </Animated.View>

//       {/* Animated Drawer */}
//       <Animated.View
//         style={[
//           styles.drawerContainer,
//           { transform: [{ translateX: drawerTranslateX }] },
//         ]}
//       >
//         <View style={styles.drawerContent}>
//           <View style={styles.profileContainer}>
//             {/* <View style={[styles.profileIcon, { backgroundColor: "gray" }]} /> */}
//             <View style={{margin: 10}}> <FontAwesomeIcon icon={faUserCircle} size={24} color="#333333" /> </View>
//             <Text style={styles.profileName}>{userName}</Text>
//           </View>
//           <View style={styles.separator} />

//           {/* Conditional Navigation */}
//           {userRole === "mentee" && (
//             <>
//               <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("MenteeDashboard")}
//                   title="My Mentors"
//                 />
//               </View>
//               {/* <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("MenteeProfileScreen")}
//                   title="Mentee Profile"
//                 />
//               </View> */}
//               <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("MenteeRoadmap")}
//                   title="View Roadmap"
//                 />
//               </View>
//             </>
//           )}

//           {userRole === "mentor" && (
//             <>
//               <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("MentorDashboard")}
//                   title="Mentor Dashboard"
//                 />
//               </View>
//               {/* <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("MentorProfileScreen")}
//                   title="Mentor Profile"
//                 />
//               </View> */}
//               <View style={styles.menuItem}>
//                 <Button
//                   onPress={() => navigation.navigate("generateRoadmap")}
//                   title="Generate Roadmap"
//                 />
//               </View>
//             </>
//           )}

//           {/*Logout Button */}
//           {/* <View style={styles.menuItem}>
//           <Button
//             onPress={() => {
//               props.toggleDrawer(); // Close the drawer first
//               storage.clearAll() // Remove user data from storage
//               navigation.navigate('SignInPage'); // Then navigate to SignInPage
//             }}
//             title="Logout"
//           />
// </View>
//           {/* <View style={styles.menuItem}>
//             <TouchableOpacity onPress={()=> navigation.navigate("SignInPage")} >
//                               <Text>
//                                 Log Out
//                                 </Text>
//                               </TouchableOpacity>
//           </View> 
        
//         </View> */}
//         <View style={styles.menuItem}>
//             <Button onPress={handleLogout} title="Logout" />
//           </View>
//         </View>
//       </Animated.View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: width,
//     height: height,
//     backgroundColor: "black",
//     zIndex: 999,
//   },
//   drawerContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: width * 0.8,
//     height: height,
//     zIndex: 1000,
//     elevation: 4,
//   },
//   drawerContent: {
//     alignItems:"baseline",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "white",
//     padding: 16,
//   },
//   profileContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },
//   profileIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#ccc",
//     marginVertical: 8,
//   },
//   menuItem: {
//     paddingVertical: 12,
//   },
// });

// export default CustomDrawerContent;


import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Button,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { MMKV } from "react-native-mmkv";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/sliceLogin";
import { RootState } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");

interface CustomDrawerContentProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const CustomDrawerContent = (props: CustomDrawerContentProps) => {
  const userName= useSelector((state:RootState)=> state.login.name);
  const dispatch = useDispatch();
  const storage = new MMKV();
  const [drawerAnimation] = useState(new Animated.Value(0));
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const overlayOpacity = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  useEffect(() => {
    if (props.isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [props.isOpen, openDrawer, closeDrawer]);

  const handleLogout = () => {
    dispatch(logout());
    storage.delete("role");
    storage.delete("token");
    props.toggleDrawer();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignInPage' }], // Replace with your login screen name
      }))
    // navigation.navigate("SignInPage");
  };

  return (
    <>
      {/* Animated Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={props.toggleDrawer} />
      </Animated.View>

      {/* Animated Drawer */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: drawerTranslateX }] },
        ]}
      >
        <View style={styles.drawerContent}>
          <View style={styles.profileContainer}>
            {/* <View style={[styles.profileIcon, { backgroundColor: "gray" }]} /> */}
            <View style={{margin: 10}}> <FontAwesomeIcon icon={faUserCircle} size={24} color="#333333" /> </View>
            <Text style={styles.profileName}>{userName}</Text>
          </View>
          <View style={styles.separator} />

          {/* Conditional Navigation */}
          {userRole === "mentee" && (
            <>
              <View style={styles.menuItem}>
                <Button
                  onPress={() => {
                    props.toggleDrawer(); // Close the drawer before navigating
                    navigation.navigate("MenteeDashboard");
                  }}
                  title="My Mentors"
                />
              </View>
              {/* <View style={styles.menuItem}>
                <Button
                  onPress={() => navigation.navigate("MenteeProfileScreen")}
                  title="Mentee Profile"
                />
              </View> */}
              <View style={styles.menuItem}>
                <Button
                  onPress={() => {
                    props.toggleDrawer(); // Close the drawer before navigating
                    navigation.navigate("MenteeRoadmap");
                  }}
                  title="View Roadmap"
                />
              </View>
            </>
          )}

          {userRole === "mentor" && (
            <>
              <View style={styles.menuItem}>
                <Button
                  onPress={() => navigation.navigate("MentorDashboard")}
                  title="Mentor Dashboard"
                />
              </View>
              {/* <View style={styles.menuItem}>
                <Button
                  onPress={() => navigation.navigate("MentorProfileScreen")}
                  title="Mentor Profile"
                />
              </View> */}
              <View style={styles.menuItem}>
                <Button
                  onPress={() => navigation.navigate("generateRoadmap")}
                  title="Generate Roadmap"
                />
              </View>
            </>
          )}

          {/*Logout Button */}
          {/* <View style={styles.menuItem}>
          <Button
            onPress={() => {
              props.toggleDrawer(); // Close the drawer first
              storage.clearAll() // Remove user data from storage
              navigation.navigate('SignInPage'); // Then navigate to SignInPage
            }}
            title="Logout"
          />
</View>
          {/* <View style={styles.menuItem}>
            <TouchableOpacity onPress={()=> navigation.navigate("SignInPage")} >
                              <Text>
                                Log Out
                                </Text>
                              </TouchableOpacity>
          </View> 
        
        </View> */}
        <View style={styles.menuItem}>
            <Button onPress={handleLogout} title="Logout" />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "black",
    zIndex: 999,
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height,
    zIndex: 1000,
    elevation: 4,
  },
  drawerContent: {
    alignItems:"baseline",
    width: "100%",
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