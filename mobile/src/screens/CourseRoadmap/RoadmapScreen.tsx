

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchRoadmap } from '../../redux/slices/sliceRoadmapTopics';
import AppBar from '../../components/appbar_component';
import { useIsFocused } from '@react-navigation/native';
import { ListRoadmapItems } from '../../components/roadmap/RoadmapListItemsComponent';
import { RoadmapResponse } from '../../types/RoadmapTypes';
import { ViewListRoadmapItems } from '../../components/roadmap/viewRoadmap';

interface RoadmapScreenProps {
  route: {
    params: {
      roadmap_id: number;
    };
  };
  navigation: {
    navigate: (screen: string) => void;
  };
}

const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ navigation,route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { roadmap_id } = route.params;

  const {
    status,
   refresh,
   roadmap


  } = useSelector((state: RootState) => state.viewRoadmap);
  const isFocused = useIsFocused();


 
// Inside the component, add this useEffect dependency
useEffect(() => {
  dispatch(fetchRoadmap(roadmap_id)).then((response) => {

  });
}, [dispatch, refresh,roadmap_id,isFocused]);
// const roadmapItems:RoadmapResponse = status === 'success' ? {
//   status_code: 200,
//   message: 'success',
//   roadmap_id: roadmap_id,
//   roadmap_explanation: roadmapExplanation,
//   topics: [...assignedTopics, ...completedTopics, ...markedTopics, ...reassignedTopics],
// } : {
//   message: 'error',
//   roadmap_explanation: 'error',
//   status_code: 500,
//   roadmap_id: 0,
//   topics: [],
// };
  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

 else if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load roadmap. Please try again later.</Text>
      </View>
    );
  }
else if (status === 'success') {

  return (
    
    <ScrollView style={styles.container}>
       <AppBar
          onProfilePress={() => { navigation.navigate('MenteeProfileScreen'); }}
          openDrawer={() => { }}
          title="Roadmap"
        />
     {
        (roadmap && roadmap.topics.length > 0 )?
     (<ViewListRoadmapItems roadmap={roadmap}  />):(<></>)
     }  
      
    </ScrollView>
  );}
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  explanation: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default RoadmapScreen;