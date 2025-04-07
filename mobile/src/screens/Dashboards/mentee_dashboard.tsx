import React, { useEffect, useState, FC } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Dropdown } from 'react-native-element-dropdown';
import { getMentorList, sendMentorRequest } from '../../redux/slices/sliceMenteeDashboard';
import { ScreenProps } from '../../navigation/types';

const MenteeDashboard: FC<ScreenProps<"MenteeDashboard">> = ({navigation}) => {  
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
      <AppBar onProfilePress={() => {navigation.navigate("MenteeProfileScreen")}} openDrawer={() => {}} />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      {/*Dropdown button for selecting the domain.*/}
      <Dropdown 
        style= {{marginHorizontal: 20}}
        data={data} 
        labelField={"label"}
        valueField="value"
        value={value}
        placeholder="Select Domain"
        onChange= {(item)=>{setValue(item.value)}}
      />

      <Button 
        title="Find Mentors"
        onPress= {submitDomain}
      />
        {/* <Button
              title="Logout"
              onPress={()=>{
                console.log("Navigation from mentee dashboard")
                navigation.replace('SignInPage')}}/> */}

                 {/* <TouchableOpacity onPress={()=> navigation.navigate("SignInPage")} >
                  <Text>
                    Log Out
                    </Text>
                  </TouchableOpacity> */}

      {/* List of the Mentors */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* If there are not mentors then */}
        {mentorList=== null || mentorList.length === 0 ? (
          <Text style={styles.noRequestsText}>No mentors found at this moment</Text>
        ) : 
        /* List all the mentors */
        (
          mentorList.map(mentor => (
            <View key={mentor.id} style={styles.menteeRequest}>
              <Text style={styles.text}>{mentor.name}</Text>
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
    alignItems: "center",
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

export default MenteeDashboard;
