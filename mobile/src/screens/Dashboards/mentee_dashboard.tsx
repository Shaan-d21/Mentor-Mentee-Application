// import React, { FC } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import AppBar from '../../components/appbar_component';
// import { ScreenProps } from '../../navigation/types';

// const MenteeDashboard: FC<ScreenProps<"MenteeDashboard">> = ({navigation}) => {
  
//   const courses = [
//     { name: 'Course 1', Mentee: 'Mentor A', modulesCompleted: 3, totalModules: 24, daysRemaining: 10, color: '#e6f7ff' },
//     { name: 'Course 2', Mentee: 'Mentor B', modulesCompleted: 5, totalModules: 24, daysRemaining: 15, color: '#f0e6ff' },
//     { name: 'Course 3', Mentee: 'Mentor C', modulesCompleted: 8, totalModules: 24, daysRemaining: 20, color: '#ffe6f0' },
//   ];
//   return (
//     <View style={styles.container}>
//       <AppBar onProfilePress={()=>{
//         navigation.navigate('ProfileScreen')
//       }}openDrawer={()=>{}} />
//       <View style={styles.searchBar}>
//         <FontAwesomeIcon icon={faSearch} size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search Courses"
//           placeholderTextColor="#888"
//         />
//       </View>
//       <Text style={styles.activeCoursesText}> Active Courses</Text>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {courses.map((course, index) => (
//           <View
//             key={index}
//             style={[styles.card, { backgroundColor: course.color }]}>
//             <Text style={styles.courseName}>{course.name}</Text>
//             <Text style={styles.MenteeName}>Mentee: {course.Mentee}</Text>
//             <View style={styles.cardFooter}>
//               <Text style={styles.moduleText}>Module completed {course.modulesCompleted}/{course.totalModules}</Text>
//               <Text style={styles.daysRemainingText}>{course.daysRemaining} Days remaining</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FAFAFA',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     margin: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchIcon: {
//     marginRight: 10,
//     color: '#BDBDBD',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   activeCoursesText: {
//     fontSize: 18,
//     color: '#757575',
//     marginLeft: 20,
//     marginBottom: 10,
//     fontWeight: '500',
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20, // Add padding to the bottom of the scroll view
//   },
//   card: {
//     backgroundColor: '#e6f7ff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   courseName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   MenteeName: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   moduleText: {
//     fontSize: 12,
//     color: '#777',
//   },
//   daysRemainingText: {
//     fontSize: 12,
//     color: '#777',
//   },
// });

// export default MenteeDashboard;




import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Dropdown } from 'react-native-element-dropdown';
import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';

const MentorDashboard = () => {  
  const dispatch = useDispatch<AppDispatch>();

  const data=[
    {label: "Programming Languages", value: "Programming Languages"},
    {label: "Database & Backend", value: "Database & Backend"},
    {label: "Cloud Computing", value: "Cloud Computing"},
    {label: "DevOps & Deployment", value: "DevOps & Deployment"},
    {label: "Artificial Intelligence & Machine Learning", value: "Artificial Intelligence & Machine Learning"},
    {label: "Data Science & Analytics", value: "Data Science & Analytics"},
    {label: "Project & Team Management", value: "Project & Team Management"},
    {label: "Software Development", value: "Software Development"},
    {label: "Soft Skills", value: "Soft Skills"},
    {label: "Web Development", value: "Web Development"}
  ];
  const {mentorList, requestMentorId}= useSelector((state:RootState)=> state.menteeDashboard)

  const [value, setValue] = useState('');
  // useEffect(()=>{console.log(`value is ${JSON.stringify(value)}`)}, [value]);

const userName = useSelector((state: RootState) => state.login.name);

  
  const submitDomain= ()=>{
    dispatch(getMentorList(value));
    // console.log(`Users are : ${JSON.stringify(mentorList)}`);
  }
  const sendRequest= (id:number, domain:string)=>{
    // console.log(`id is ${id} and domain is ${domain}`);
    dispatch(sendMentorRequest({id, domain}));
    console.log("send request");
  }


  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => {}} openDrawer={() => {}} />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      {/*Dropdown button for selecting the domain.*/}
      <Dropdown 
        data={data} 
        labelField={"label"}
        valueField="value"
        value={value}
        placeholder="Select Domain"
        onChange= {(item)=>{setValue(item.value)}}
      />

      <Button 
        title="Submit"
        onPress= {submitDomain}
      />

      {/* List of the Mentors */}
      <ScrollView contentContainerStyle={styles.content}>
        /* If there are not mentors then */
        {mentorList=== null || mentorList.length === 0 ? (
          <Text style={styles.noRequestsText}>No mentors found at this moment</Text>
        ) : 
        /* List all the mentors */
        (
          mentorList.map(mentor => (
            <View key={mentor.id} style={styles.menteeRequest}>
              <Text style={styles.text}>Connect with {mentor.name}</Text>
              {
                requestMentorId=== mentor.id ?(
                  <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
                ) : (
                  <Button
                title="Request"
                onPress={() => sendRequest(mentor.id, value)}
                disabled={requestMentorId !== null} // Disable all other buttons
              />
                )
              }
              {/* <Button title="Request" onPress= {()=>{sendRequest(mentor.id, mentor.domain)}}/> */}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  content: { flexGrow: 1, padding: 20 },
  noRequestsText: { textAlign: 'center', color: '#888', fontSize: 16 },
  
  menteeRequest: { 
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#FFF9C4',
  },

  text: { fontSize: 18, fontWeight: '600' },

  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 5, 
    backgroundColor: '#fff' 
  },

  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

  acceptedTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  acceptedMentee: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    padding: 12, 
    marginVertical: 5, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: '#4CAF50', 
    backgroundColor: '#E8F5E9',
    textAlign: 'center' 
  },
});

export default MentorDashboard;
