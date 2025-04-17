

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchRoadmap } from '../../redux/slices/sliceRoadmapTopics';
import { ListRoadmapItems } from '../../components/roadmap/viewRoadmap';
import { RoadmapResponse } from '../../types/ViewRoadmapTypes';
import AppBar from '../../components/appbar_component';

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
    roadmapExplanation,
    assignedTopics,
    completedTopics,
    markedTopics,
  } = useSelector((state: RootState) => state.viewRoadmap);

  const [RoadmapItems, setRoadmapItems] = useState<RoadmapResponse | null>(null);

 
  useEffect(() => {
    dispatch(fetchRoadmap(roadmap_id)).then((response) => {
      setRoadmapItems({
        status_code: 200,
        message: 'success',
        roadmap_id: roadmap_id,
        roadmap_explanation: roadmapExplanation,
        topic:[...assignedTopics, ...completedTopics, ...markedTopics]
    
      })
    });
  }, [dispatch, roadmap_id]);

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
     
      <ListRoadmapItems roadmap={RoadmapItems} />
       
      
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