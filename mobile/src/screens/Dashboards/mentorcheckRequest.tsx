// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
//   Modal,
//   TextInput,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   fetchPendingRequest,
//   approveRejectMenteeThunk,
// } from '../../redux/slices/mentorSlice';
// import {RootState, AppDispatch} from '../../redux/store';

// const CheckRequestScreen :React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [currentAction, setCurrentAction] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [comment, setComment] = useState<string>('');

//   const {pending} = useSelector((state: RootState) => state.menteeRequests);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await dispatch(fetchPendingRequest());
//       setLoading(false);
//     };
//     fetchData();
//   }, [dispatch]);

//   const handleApprove = (id: number) => {
//     //dispatch(approveMenteeRequestThunk(id));
//     {
//       Alert.prompt('Optional Comment', 'Add a comment if you like:', text => {
//         dispatch(
//           approveRejectMenteeThunk({
//             menteeId: id,
//             status: 'approve',
//             comment: text,
//           }),
//         );
//       });
//     }

//     const handleReject = (id: number) => {
//       //dispatch(rejectMentee(id));
//       setSelectedId(id);
//       setCurrentAction('reject');
//       setModalVisible(true);
//     };

//     const handleConfirmReject = () => {
//       if (selectedId !== null) {
//         dispatch(
//           approveRejectMenteeThunk({
//             menteeId: selectedId,
//             status: 'reject',
//             comment,
//           }),
//         );
//       }
//       setModalVisible(false);
//       setComment('');
//     };
//     //   const renderRow = ({item}: any) => (
//     //     <View style={styles.tableRow}>
//     //       <Text style={styles.cellId}>{item.id}</Text>
//     //       <Text style={styles.cellName} numberOfLines={1} ellipsizeMode="tail">
//     //         {item.name}
//     //       </Text>
//     //       <Text style={styles.cellEmail} numberOfLines={1} ellipsizeMode="tail">
//     //         {item.email}
//     //       </Text>
//     //       <Text style={styles.cellDomain} numberOfLines={1} ellipsizeMode="tail">
//     //         {item.domain}
//     //       </Text>
//     //       <View style={styles.actionCell}>
//     //         <TouchableOpacity
//     //           onPress={() => handleApprove(item.id)}
//     //           style={[styles.btn, styles.approve]}>
//     //           <Text style={styles.btnText}>Approve</Text>
//     //         </TouchableOpacity>
//     //         <TouchableOpacity
//     //           onPress={() => handleReject(item.id)}
//     //           style={[styles.btn, styles.reject]}>
//     //           <Text style={styles.btnText}>Reject</Text>
//     //         </TouchableOpacity>
//     //       </View>
//     //     </View>
//     //   );

//     //   return (
//     //     <ScrollView style={styles.container}>
//     //       <Text style={styles.title}>Pending Mentee Requests</Text>

//     //       {loading ? (
//     //         <ActivityIndicator size="large" color="blue" />
//     //       ) : pendingRequests.length === 0 ? (
//     //         <Text>No requests found.</Text>
//     //       ) : (
//     //         <ScrollView horizontal>
//     //           <View style={styles.table}>
//     //             <View style={[styles.tableRow, styles.tableHeader]}>
//     //               <Text style={styles.cellIdHeader}>ID</Text>
//     //               <Text style={styles.cellNameHeader}>Name</Text>
//     //               <Text style={styles.cellEmailHeader}>Email</Text>
//     //               <Text style={styles.cellDomainHeader}>Domain</Text>
//     //               <Text style={styles.actionCellHeader}>Action</Text>
//     //             </View>
//     //             <FlatList
//     //               data={pendingRequests}
//     //               renderItem={renderRow}
//     //               keyExtractor={item => item.id.toString()}
//     //             />
//     //           </View>
//     //         </ScrollView>
//     //       )}
//     //     </ScrollView>
//     //   );
//     // };

//     // export default CheckRequestsScreen;

//     // const styles = StyleSheet.create({
//     //   container: {
//     //     flex: 1,
//     //     padding: 16,
//     //     backgroundColor: '#FFF',
//     //   },
//     //   title: {
//     //     fontSize: 22,
//     //     fontWeight: 'bold',
//     //     marginBottom: 16,
//     //     textAlign: 'center',
//     //   },
//     //   table: {
//     //     borderWidth: 1,
//     //     borderColor: '#CCC',
//     //     borderRadius: 8,
//     //     minWidth: 700,
//     //   },
//     //   tableHeader: {
//     //     backgroundColor: '#f2f2f2',
//     //   },
//     //   tableRow: {
//     //     flexDirection: 'row',
//     //     borderBottomWidth: 1,
//     //     borderColor: '#E0E0E0',
//     //     alignItems: 'center',
//     //     paddingVertical: 10,
//     //   },
//     //   // Header Cells
//     //   cellIdHeader: {
//     //     width: 50,
//     //     fontWeight: 'bold',
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellNameHeader: {
//     //     width: 120,
//     //     fontWeight: 'bold',
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellEmailHeader: {
//     //     width: 180,
//     //     fontWeight: 'bold',
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellDomainHeader: {
//     //     width: 120,
//     //     fontWeight: 'bold',
//     //     paddingHorizontal: 6,
//     //   },
//     //   actionCellHeader: {
//     //     width: 180,
//     //     fontWeight: 'bold',
//     //     paddingHorizontal: 6,
//     //   },

//     //   // Row Cells
//     //   cellId: {
//     //     width: 50,
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellName: {
//     //     width: 120,
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellEmail: {
//     //     width: 180,
//     //     paddingHorizontal: 6,
//     //   },
//     //   cellDomain: {
//     //     width: 120,
//     //     paddingHorizontal: 6,
//     //   },
//     //   actionCell: {
//     //     width: 180,
//     //     flexDirection: 'row',
//     //     justifyContent: 'center',
//     //     gap: 6,
//     //     paddingHorizontal: 6,
//     //   },
//     //   btn: {
//     //     paddingVertical: 5,
//     //     paddingHorizontal: 10,
//     //     borderRadius: 6,
//     //   },
//     //   approve: {
//     //     backgroundColor: '#4CAF50',
//     //   },
//     //   reject: {
//     //     backgroundColor: '#F44336',
//     //   },
//     //   btnText: {
//     //     color: '#FFF',
//     //     fontWeight: '600',
//     //     fontSize: 13,
//     //   },
//     // });
//     interface PendingRequest {
//       id: number;
//       name: string;
//       email: string;
//       role: string;
//       domain: string;
//     }

//     const renderItem = ({item}: {item: PendingRequest}) => (
//       <View style={styles.row}>
//         <Text style={styles.cell}>{item.name}</Text>
//         <Text style={styles.cell}>{item.email}</Text>
//         <Text style={styles.cell}>{item.role}</Text>
//         <Text style={styles.cell}>{item.domain}</Text>
//         <View style={styles.actionCell}>
//           <TouchableOpacity
//             onPress={() => handleApprove(item.id)}
//             style={styles.approve}>
//             <Text style={styles.btnText}>Approve</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleReject(item.id)}
//             style={styles.reject}>
//             <Text style={styles.btnText}>Reject</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );

//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Approve/Reject Mentee Requests</Text>
//         <FlatList
//           data={pending}
//           renderItem={renderItem}
//           keyExtractor={item => item.id.toString()}
//         />

//         <Modal visible={modalVisible} transparent>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Reason for rejection:</Text>
//             <TextInput
//               placeholder="Enter comment"
//               value={comment}
//               onChangeText={setComment}
//               style={styles.input}
//             />
//             <TouchableOpacity
//               onPress={handleConfirmReject}
//               style={styles.reject}>
//               <Text style={styles.btnText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       </View>
//     );

// };

// export default CheckRequestScreen;
// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16},
//   title: {fontSize: 20, fontWeight: 'bold', marginVertical: 10},
//   row: {flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1},
//   cell: {flex: 1, textAlign: 'center'},
//   actionCell: {flex: 1.5, flexDirection: 'row', justifyContent: 'space-around'},
//   approve: {backgroundColor: 'green', padding: 6, borderRadius: 6},
//   reject: {backgroundColor: 'red', padding: 6, borderRadius: 6},
//   btnText: {color: 'white'},
//   modalView: {
//     margin: 20,
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   modalText: {fontSize: 16},
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 6,
//   },
// })
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchPendingRequest,
  approveRejectMenteeThunk,
  fetchApprovedMentees,
} from '../../redux/slices/mentorSlice';
import {RootState, AppDispatch} from '../../redux/store';
import AppBar from '../../components/appbar_component';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types'; // Adjust the path to your navigation types file
import {Icon} from 'react-native-elements';

interface PendingRequest {
  id: number;
  name: string;
  email: string;
  role: string;
  domain: string;
}
interface Props {
  onBackPress: () => void;
  onProfilePress: () => void;
  openDrawer: () => void;
}

const CheckRequestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState<string>('');
  const [currentAction, setCurrentAction] = useState<
    'approve' | 'reject' | null
  >(null);
  const [approvedMentees, setApprovedMentees] = useState([]);

  const {pending,isActionDone,error,status} = useSelector((state: RootState) => state.menteeRequests);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPendingRequest());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleApprove = (id: number) => {
    setSelectedId(id);
    setCurrentAction('approve');
    setModalVisible(true);
  };

  const handleReject = (id: number) => {
    setSelectedId(id);
    setCurrentAction('reject');
    setModalVisible(true);
  };

  const handleConfirmAction = () => {
    if (selectedId !== null && currentAction) {
      if (currentAction === 'reject') {
        if (comment.trim() === '') {
          Alert.alert('Please enter a comment before rejecting.');
          return;
        }

        dispatch(
          approveRejectMenteeThunk({
            menteeId: selectedId,
            status: 'not approved',
            comment: comment.trim(), // Use the comment provided by the user
          }),
        ).then(() => {
          
          dispatch(fetchApprovedMentees());
          dispatch(fetchPendingRequest());
          setModalVisible(false);
          setComment('');
          setSelectedId(null);
          setCurrentAction(null);
        });
      } else if (currentAction === 'approve') {
        // Approval flow
        dispatch(
          approveRejectMenteeThunk({
            menteeId: selectedId,
            status: 'approved',
            comment: comment.trim() || '', // Use the comment provided by the user
          }),
        ).then(() => {
          dispatch(fetchPendingRequest());
          setModalVisible(false);
          setComment('');
          setSelectedId(null);
          setCurrentAction(null);
        });
      }
    }
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>Name</Text>
      <Text style={[styles.cell, styles.headerCell]}>Email</Text>
      <Text style={[styles.cell, styles.headerCell]}>Role</Text>
      <Text style={[styles.cell, styles.headerCell]}>Domain</Text>
      <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
    </View>
  );

  const renderItem = ({item, index}: {item: PendingRequest; index: number}) => (
    <View
      style={[
        styles.row,
        {backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff'},
      ]}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <Text style={styles.cell}>{item.domain}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity
          onPress={() => handleApprove(item.id)}
          style={styles.approve}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleReject(item.id)}
          style={styles.reject}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar
        onProfilePress={() => navigation.navigate('MentorProfileScreen')}
        openDrawer={() => {}}
      />

      <View style={styles.titleRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MentorDashboard')}>
          <Icon name="arrow-left" type="font-awesome" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mentee Requests</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : pending.length === 0 ? (
        <Text>No requests found.</Text>
      ) : (
        <ScrollView horizontal>
          <View style={styles.table}>
            {renderHeader()}
            <FlatList
              data={pending}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </ScrollView>
      )}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000aa',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '80%',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
              {currentAction === 'approve'
                ? 'Approve Request'
                : 'Reject Request'}
            </Text>

            <TextInput
              placeholder={
                currentAction === 'approve'
                  ? 'Enter comment (optional)'
                  : 'Please enter a comment'
              }
              value={comment}
              onChangeText={setComment}
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 15,
              }}
              multiline
            />

            <TouchableOpacity
              style={{
                backgroundColor:
                  currentAction === 'approve' ? '#4CAF50' : '#f44336',
                paddingVertical: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
              onPress={handleConfirmAction}>
              <Text
                style={{color: '#fff', textAlign: 'center', fontWeight: '600'}}>
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#9e9e9e',
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={() => setModalVisible(false)}>
              <Text
                style={{color: '#fff', textAlign: 'center', fontWeight: '600'}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Modal visible={modalVisible} transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Reason for rejection:</Text>
          <TextInput
            placeholder="Enter comment"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleConfirmReject} style={styles.reject}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </View>
  );
};

export default CheckRequestScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginVertical: 10},
  table: {minWidth: 700}, // Allow horizontal scroll

  headerRow: {
    backgroundColor: 'black',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // light background for rows
  },

  cell: {
    flex: 1,
    width: 140, // Fixed width for each cell to maintain column structure

    textAlign: 'center',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'space-around', // or 'space-between' / 'flex-start'
    alignItems: 'center',
    gap: 8, // If using React Native 0.71+, or you can use margin manually
  },

  approve: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  reject: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  modalView: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {fontSize: 16, marginBottom: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
