import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchRoadmapTopics} from '../../redux/slices/sliceRoadmapTopics';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'; // Import back arrow icon
import AppBar from '../../components/appbar_component';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ListRoadmapItems} from '../../components/roadmap/RoadmapListItemsComponent'; // adjust the path as per your folder structure

interface RoadmapScreenProps {
  route: {
    params: {
      mentor_id: number;
      domain_name: string;
      domain_id: number;
    };
  };
}

const RoadmapScreen: React.FC<RoadmapScreenProps> = ({route}) => {
  const {mentor_id, domain_name, domain_id} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {roadmapName, loading, error} = useSelector(
    (state: RootState) => state.roadmap,
  );

  useEffect(() => {
    dispatch(fetchRoadmapTopics({mentorId: mentor_id, domainId: domain_id}));
  }, [dispatch, mentor_id, domain_id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const roadmapSections = roadmapName
    .split('\n')
    .map(item => item.trim().replace(/^\*\s*/, ''));

  return (
    <ScrollView style={styles.container}>
      {/* <AppBar
  onProfilePress={() => {
    console.log("Profile icon clicked");
    navigation.navigate('MenteeProfileScreen');
  }}
  openDrawer={() => {}}
/> */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          size={24}
          color="#000000"
          style={styles.backButtonIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Roadmap for {domain_name}</Text>
      {/* {roadmapSections.map((section, index) => (
        <View style={styles.section} key={index}>
          <Text style={styles.sectionTitle}>{section}</Text>
        </View>
      ))} */}
      <ListRoadmapItems roadmap={roadmapSections} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  backButtonIcon: {
    marginRight: 5,
  },
});

export default RoadmapScreen;
