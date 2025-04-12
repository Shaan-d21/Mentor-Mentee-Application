// import React, {FC, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import {Avatar} from 'react-native-elements';
// import AppBar from '../../components/appbar_component';
// import {useSelector, useDispatch} from 'react-redux';
// import {RootState, AppDispatch} from '../../redux/store';
// import {ScreenProps} from '../../navigation/types';
// import {fetchApprovedMentees} from '../../redux/slices/mentorSlice';

// const COLUMN_WIDTH = 130;

// const MentorDashboard: FC<ScreenProps<'MentorDashboard'>> = ({navigation}) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const userName = useSelector((state: RootState) => state.login.name);
//   const acceptedMentees = useSelector(
//     (state: RootState) => state.menteeRequests.acceptedRequests,
//   );
//   const approvedMentees = useSelector(state => state.mentor.approvedMentees);

//   useEffect(() => {
//   //   // Fetch only approved mentees here
//      dispatch(fetchAprrovedMentees()); // Uncomment and replace 'menteeId' with the actual argument(s) required
//    }, [dispatch]);

//   const handleCheckRequest = () => {
//     navigation.navigate('CheckRequestScreen');
//   };

//   const renderMenteeRow = ({item}: {item: any}) => (
//     <View style={styles.row}>
//       <Text style={styles.cell}>{item.name}</Text>
//       <Text style={styles.cell}>{item.email}</Text>
//       <Text style={styles.cell}>{item.role}</Text>
//       <Text style={styles.cell}>{item.domain}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <AppBar
//         onProfilePress={() => navigation.navigate('MentorProfileScreen')}
//         openDrawer={() => {}}
//       />
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {userName} 👋</Text>
//         <Avatar rounded icon={{name: 'user', type: 'font-awesome'}} />
//       </View>

//       <TouchableOpacity style={styles.checkButton} onPress={handleCheckRequest}>
//         <Text style={styles.checkButtonText}>Check Request</Text>
//       </TouchableOpacity>

//       <ScrollView horizontal>
//         <View>
//           {/* Header Row */}
//           <View style={styles.headerRow}>
//             <Text style={styles.headerCell}>Mentee Name</Text>
//             <Text style={styles.headerCell}>Email</Text>
//             <Text style={styles.headerCell}>Role</Text>
//             <Text style={styles.headerCell}>Domain</Text>
//           </View>

//           {/* Vertically scrollable rows */}
//           <ScrollView style={{maxHeight: 300}}>
//             {acceptedMentees.map(item => (
//               <View style={styles.row} key={item.id}>
//                 <Text style={styles.cell}>{item.name}</Text>
//                 <Text style={styles.cell}>{item.email}</Text>
//                 <Text style={styles.cell}>{item.role}</Text>
//                 <Text style={styles.cell}>{item.domain}</Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F5F5F5', padding: 20},
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   headerText: {fontSize: 22, fontWeight: 'bold', color: '#333'},
//   checkButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   checkButtonText: {color: '#FFF', fontWeight: 'bold'},
//   headerRow: {
//     flexDirection: 'row',
//     backgroundColor: '#222',
//     borderTopLeftRadius: 6,
//     borderTopRightRadius: 6,
//   },
//   headerCell: {
//     width: COLUMN_WIDTH,
//     color: '#FFF',
//     fontWeight: 'bold',
//     padding: 10,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#333',
//   },
//   row: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     borderBottomWidth: 1,
//     borderColor: '#DDD',
//   },
//   cell: {
//     width: COLUMN_WIDTH,
//     padding: 10,
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#EEE',
//     color: '#333',
//   },
// });

// export default MentorDashboard;
import React, {FC, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

type MentorDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MentorDashboard'
>;

const MentorDashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<MentorDashboardNavigationProp>();
  const isFocused = useIsFocused();          // <-- track focus

  // Note: approved mentees list is stored under 'approved' in your slice.
  // const approvedMentees = useSelector(
  //   (state: RootState) => state.mentor.approved,
  // );
  const {approved, pending,error,status} = useSelector(
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
  // const renderItem = ({item}: {item: any}) => (
  //   <View style={styles.row}>
  //     <Text style={styles.cell}>{item.name}</Text>
  //     <Text style={styles.cell}>{item.email}</Text>
  //     <Text style={styles.cell}>{item.role}</Text>
  //     <Text style={styles.cell}>{item.domain}</Text>
  //     <Text style={styles.cell}>{item.comment || '-'}</Text>
  //   </View>
  // );
  const renderMenteeCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faEnvelope} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.email}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faUserTag} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.role}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faCodeBranch} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.domain}</Text>
        </View>
        <View style={styles.cardItem}>
          <FontAwesomeIcon icon={faCommentDots} size={16} color="#777" style={styles.icon} />
          <Text style={styles.cardText}>{item.comment || 'No comment'}</Text>
        </View>
      </View>
    </View>
  );

  return (
  
  <View style={styles.container}>
    {/* {status === 'loading' && <Text>Loading...</Text>
    } */}
      <AppBar
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}
        openDrawer={() => {}}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        {/* <Avatar rounded icon={{name: 'user', type: 'font-awesome'}} /> */}
      </View>
      <View style={styles.rowHeaderContainer}>
        <Text style={styles.title}>Approved Mentees</Text>
        <TouchableOpacity
          style={[styles.checkBtn, {marginTop: 30}]}
          onPress={() => navigation.navigate('CheckRequestScreen')}>
          <Text style={styles.checkBtnText}>Check Request</Text>
        </TouchableOpacity>
      </View>

      {/* <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Email</Text>
            <Text style={[styles.cell, styles.headerCell]}>Role</Text>
            <Text style={[styles.cell, styles.headerCell]}>Domain</Text>
            <Text style={[styles.cell, styles.headerCell]}>Comment</Text>
          </View>
          {approved.length === 0 ? (
            <Text style={styles.noMenteesText}>
              No approved mentees available.
            </Text>
          ) : (
            <FlatList
              data={approved}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView> */}

<FlatList
  data={approved}
  keyExtractor={item => item.id.toString()}
  renderItem={renderMenteeCard}
/>

    </View>
  );
};

export default MentorDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  cardHeader: {
    marginBottom: 10,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  cardBody: {
    paddingLeft: 6,
  },
  
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  icon: {
    marginRight: 10,
  },
  
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  
  
  separator: {
    height: 1,
    backgroundColor: 'white', // Adjust color as needed
  },
  rowHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 3,
    marginTop: 3,
    padding: 10,
    marginRight: 10,
  },
  noMenteesText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#777',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: 'white',
    color: 'white', // Adjust color as needed
  },
  lastHeaderCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  checkBtn: {
    backgroundColor: '#1a73e8',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  checkBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  table: {
    minWidth: 700, // Adjust this width to ensure horizontal scrolling as needed
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  headerRow: {
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    width: 140, // Fixed width for each cell to maintain column structure
    textAlign: 'center',
  },
});
