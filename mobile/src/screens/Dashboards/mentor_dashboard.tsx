import React, {FC, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchApprovedMentees} from '../../redux/slices/mentorSlice';
import {AppDispatch, RootState} from '../../redux/store';

// Navigation types
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types'; // Adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faUserTag, faCodeBranch, faCommentDots } from '@fortawesome/free-solid-svg-icons';

import Avatar from 'react-native-elements/dist/avatar/Avatar';
import AppBar from '../../components/appbar_component';

// Get responsive font size based on screen width
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 375 is a standard width to scale from

const normalize = (size:any


  
) => {
  const newSize = size * scale;
  return Math.round(Math.min(newSize, size * 1.2)); // Cap the size increase
};

type MentorDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MentorDashboard'
>;

const MentorDashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<MentorDashboardNavigationProp>();
  const isFocused = useIsFocused();          // <-- track focus
  const { width } = useWindowDimensions(); // For responsive updates

  // Note: approved mentees list is stored under 'approved' in your slice.
  const {approved, pending, error, status} = useSelector(
    (state: RootState) => state.mentorDashboard,
  );
  const userName = useSelector((state: RootState) => state.login.name);

  useEffect(() => {
    if (isFocused) {                        // <-- refetch only when focused
      dispatch(fetchApprovedMentees());
    }
  }, [isFocused, ]);
  
  useEffect(() => {
    if (isFocused) {                        // <-- refetch only when focused
      dispatch(fetchApprovedMentees());
    }
  }, [ ]);

  const pressMoveToTopicList= (item: any) => {
    console.log("Button pressed");
    navigation.navigate("MentorProgress", {roadmap_id: item.roadmap_id, mentee_id: item.id});
    console.log(item)
  }

  const renderMenteeCard = ({ item }: { item: any }) => {
    console.log(item);

    return (
      <Pressable onPress={() => pressMoveToTopicList(item)}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardItem}>
              <FontAwesomeIcon 
                icon={faEnvelope} 
                size={normalize(14)} 
                color="#777" 
                style={styles.icon} 
              />
              <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
                {item.email}
              </Text>
            </View>
            <View style={styles.cardItem}>
              <FontAwesomeIcon 
                icon={faUserTag} 
                size={normalize(14)} 
                color="#777" 
                style={styles.icon} 
              />
              <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
                {item.designation ?? "Intern"}
              </Text>
            </View>
            <View style={styles.cardItem}>
              <FontAwesomeIcon 
                icon={faCodeBranch} 
                size={normalize(14)} 
                color="#777" 
                style={styles.icon} 
              />
              <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
                {item.domain}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}
        openDrawer={() => {}}
      />

      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
          Hello, {userName} 👋
        </Text>
      </View>
      
      <View style={styles.rowHeaderContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          Approved Mentees
        </Text>
        <TouchableOpacity
          style={styles.checkBtn}
          onPress={() => navigation.navigate('CheckRequestScreen')}>
          <Text style={styles.checkBtnText}>Check Request</Text>
        </TouchableOpacity>
      </View>

      {approved.length === 0 ? (
        <Text style={styles.noMenteesText}>
          No approved mentees available.
        </Text>
      ) : (
        <FlatList
          data={approved}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMenteeCard}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default MentorDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '4%',
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#E0F7FA',
    padding: '4%',
    marginBottom: '3%',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    marginBottom: '2.5%',
    borderBottomWidth: 1,
    borderColor: '#B2EBF2',
    paddingBottom: '2%',
  },
  cardTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    paddingLeft: '1.5%',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: normalize(14),
    color: '#555',
    flex: 1,
  },
  cardTextTitle: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#333',
  },
  flatListContent: {
    paddingBottom: '5%',
  },
  noMenteesText: {
    textAlign: 'center',
    padding: '5%',
    fontSize: normalize(14),
    color: '#777',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
    flexWrap: 'wrap',
  },
  headerText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rowHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3%',
    paddingHorizontal: '1%',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  checkBtn: {
    backgroundColor: '#1a73e8',
    padding: '2.5%',
    borderRadius: 6,
    marginTop: '2%',
  },
  checkBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
});