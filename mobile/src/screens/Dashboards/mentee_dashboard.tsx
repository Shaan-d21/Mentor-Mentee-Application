import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { ScreenProps } from '../../navigation/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBriefcase, faCode, faClock, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { getApprovedMentorList } from '../../redux/slices/sliceMenteeDashboard';

// Define fixed font sizes for different text elements
const FONT_SIZES = {
  HEADER: 20,
  TITLE: 16,
  NORMAL: 14,
  SMALL: 12,
};

// Get responsive font size based on screen width
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 375 is a standard width to scale from

const normalize = (size: number): number => {
  // Small screen adjustment - reduce font size even more on very small screens
  if (SCREEN_WIDTH < 320) {
    return Math.max(size * 0.8, 10); // Min font size of 10
  }
  
  const newSize = size * scale;
  return Math.round(Math.min(newSize, size * 1.2)); // Cap the size increase
};

interface Mentor {
  id: number;
  name: string;
  mail: string;
  designation: string | null;
  domain_name: string | null;
  exp: number | null;
}

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const dispatch= useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.login.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions(); // Re-render on dimension changes
  
  const mentorList= useSelector((state:RootState)=> state.menteeDashboard.getApprovedMentors);
  
  useEffect(() =>{
    const response= dispatch(getApprovedMentorList());
    console.log("UI", response);
  }, []);

  const renderMentorCard = ({ item }: { item: Mentor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardItem}>
          <FontAwesomeIcon 
            icon={faEnvelope} 
            size={normalize(FONT_SIZES.SMALL)} 
            color="#777" 
            style={styles.icon} 
          />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">{item.mail}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon 
            icon={faBriefcase} 
            size={normalize(FONT_SIZES.SMALL)} 
            color="#777" 
            style={styles.icon} 
          />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">{item.designation || 'N/A'}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon 
            icon={faCodeBranch} 
            size={normalize(FONT_SIZES.SMALL)} 
            color="#777" 
            style={styles.icon} 
          />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">{item.domain_name || 'N/A'}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon 
            icon={faClock} 
            size={normalize(FONT_SIZES.SMALL)} 
            color="#777" 
            style={styles.icon} 
          />
          <Text style={styles.cardText}>{item.exp !== null ? `${item.exp} years` : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => { }} />

      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
          Hello, {userName} 👋
        </Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      <TouchableOpacity
        style={styles.checkCompatibilityButton}
        onPress={() => navigation.navigate('CheckCompatibility')} 
      >
        <Text style={styles.checkCompatibilityButtonText}>Check Compatibility</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={mentorList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMentorCard}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    padding: '5%', // Percentage-based padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
    flexWrap: 'wrap'
  },
  headerText: { 
    fontSize: normalize(FONT_SIZES.HEADER), 
    fontWeight: 'bold', 
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: normalize(FONT_SIZES.NORMAL)
  },
  card: {
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: '4%',
    marginBottom: '3%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderColor: '#B2EBF2',
    paddingBottom: '2%',
    marginBottom: '2%'
  },
  cardTitle: {
    fontSize: normalize(FONT_SIZES.TITLE),
    fontWeight: 'bold',
    color: '#333'
  },
  cardBody: {
    paddingHorizontal: '1%'
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1.5%',
    flexWrap: 'wrap'
  },
  icon: {
    marginRight: 10
  },
  cardText: {
    fontSize: normalize(FONT_SIZES.NORMAL),
    color: '#555',
    flex: 1
  },
  flatListContent: {
    paddingBottom: '5%'
  },
  checkCompatibilityButton: {
    backgroundColor: '#2196F3',
    padding: SCREEN_WIDTH < 350 ? '2%' : '3%', // Smaller padding on small screens
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: '3%'
  },
  checkCompatibilityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(FONT_SIZES.NORMAL)
  }
});

export default MenteeDashboard;