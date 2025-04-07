import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import AppBar from '../../components/appbar_component';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Dropdown } from 'react-native-element-dropdown';
import { setMentorList } from '../../redux/slices/sliceMenteeDashboard';
import { ScreenProps } from '../../navigation/types';

const COLUMN_WIDTH = 140;

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.login.name);
  const { mentorList } = useSelector((state: RootState) => state.menteeDashboard);

  const [selectedDomain, setSelectedDomain] = useState('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [, setShowDropdown] = useState(false);
  const [showCompatibilityColumns, setShowCompatibilityColumns] = useState(false);
  const [requestMentorId, setRequestMentorId] = useState<number | null>(null);

  const domainOptions = [
    { label: 'Programming Languages', value: 'Programming Languages' },
    { label: 'Database & Backend', value: 'Database & Backend' },
    { label: 'Cloud Computing', value: 'Cloud Computing' },
    { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
    { label: 'Artificial Intelligence & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
    { label: 'Data Science & Analytics', value: 'Data Science & Analytics' },
    { label: 'Software Development', value: 'Software Development' },
    { label: 'Project & Team Management', value: 'Project & Team Management' },
    { label: 'Soft Skills', value: 'Soft Skills' },
    { label: 'Web Development', value: 'Web Development' },
  ];

  useEffect(() => {
    const response = {
      domain_mentors: [
        {
          name: 'Mentor Two',
          id: 102,
          mail: 'mentor2@example.com',
          designation: 'AI Researcher',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 78,
          reason: 'Belongs to the AI/ML domain. Has strong skills in Deep Learning (advanced), Machine Learning (intermediate), and Generative AI (intermediate), which contribute to a high score with the domain bonus.'
        },
        {
          name: 'Alice AI',
          id: 103,
          mail: 'alice.ai@example.com',
          designation: 'AI Engineer',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason: 'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
        },
        {
          name: 'Bob ML',
          id: 104,
          mail: 'bob.ml@example.com',
          designation: 'ML Researcher',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason: 'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
        },
        {
          name: 'Mentor Three',
          id: 105,
          mail: 'mentor3@example.com',
          designation: 'None',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason: 'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
        }
      ],
      other_domain_mentors: [
        {
          name: 'Charlie Web',
          id: 106,
          mail: 'charlie.web@example.com',
          designation: 'Frontend Dev',
          domain: 'Web Development',
          score: 0,
          reason: 'Does not belong to the AI/ML domain. No skills to evaluate, resulting in a score of 0.'
        },
        {
          name: 'Diana Cyber',
          id: 107,
          mail: 'diana.cyber@example.com',
          designation: 'Cyber Analyst',
          domain: 'Database & Backend',
          score: 0,
          reason: 'Does not belong to the AI/ML domain. No skills to evaluate, resulting in a score of 0.'
        }
      ]
    };

    const formattedMentors = [...response.domain_mentors, ...response.other_domain_mentors].map((mentor) => ({
      id: mentor.id,
      name: mentor.name,
      email: mentor.mail,
      role: mentor.domain,
      designation: mentor.designation,
      techStack: mentor.domain,
      score: mentor.score,
      action: 'Send Request',
      comment: mentor.reason
    }));

    dispatch(setMentorList(formattedMentors));
    setFilteredList(formattedMentors);
  }, [dispatch]);

  const sendRequest = (mentorId: number, _domain: string) => {
    Alert.alert("Request Sent");
    setRequestMentorId(mentorId);
  };

  // const handleCheckCompatibility = async () => {
  //   if (!selectedDomain) return;
  
  //   setShowDropdown(true);
  //   setShowCompatibilityColumns(true);
  
  //   try {
  //     // Simulate an asynchronous operation (e.g., fetching or processing data)
  //     const filtered = await new Promise((resolve) => {
  //       setTimeout(() => {
  //         const result = mentorList.filter((mentor) =>
  //           mentor.techStack.toLowerCase().includes(selectedDomain.toLowerCase())
  //         );
  //         resolve(result);
  //       }, 500); // Simulate a delay of 500ms
  //     });
  
  //     setFilteredList(filtered as any[]); // Update the filtered list
  //     console.log('Filtered Mentors:', filtered);
  //   } catch (error) {
  //     console.error('Error filtering mentors:', error);
  //   }
  // };

  const handleCheckCompatibility = async () => {
    console.log('Selected Domain:', selectedDomain);
    console.log('Filtered List:', filteredList);
  
    if (!selectedDomain) return;
  
    setShowDropdown(true);
    setShowCompatibilityColumns(true);
  
    try {
      
      // Simulate an asynchronous operation (e.g., fetching or processing data)
      const filtered = await new Promise((resolve) => {
        setTimeout(() => {
          const result = mentorList.filter((mentor) =>
            mentor.techStack.toLowerCase().includes(selectedDomain.toLowerCase())
          );
          resolve(result);
          console.log('Filtered Mentors:', result);
        }, 500); // Simulate a delay of 500ms
      });
  
      setFilteredList(filtered as any[]); // Update the filtered list
      console.log('Filtered Mentors:', filtered);
    } catch (error) {
      console.error('Error filtering mentors:', error);
    }
  };

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
  };

  const renderMentorRow = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      {showCompatibilityColumns && <Text style={styles.cell}>{item.role}</Text>}
      <Text style={styles.cell}>{item.designation}</Text>
      <Text style={styles.cell}>{item.techStack}</Text>
      {showCompatibilityColumns && <Text style={styles.cell}>{item.score}</Text>}
      {showCompatibilityColumns && (
        <View style={[styles.cell, { alignItems: 'center' }]}>
          {requestMentorId === item.id ? (
            <Text style={{ color: "blue", marginTop: 5 }}>Pending</Text>
          ) : (
            <TouchableOpacity
              onPress={() => sendRequest(item.id, selectedDomain)}
              disabled={requestMentorId !== null}
              style={{ backgroundColor: requestMentorId !== null ? '#ccc' : '#007BFF', padding: 6, borderRadius: 4 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.action}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {showCompatibilityColumns && <Text style={styles.cell}>{item.comment}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar onProfilePress={() => navigation.navigate('MenteeProfileScreen')} openDrawer={() => {}} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userName} 👋</Text>
        <Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
      </View>

      <Dropdown
        style={styles.dropdown}
        data={domainOptions}
        labelField="label"
        valueField="value"
        value={selectedDomain}
        placeholder="Select Domain"
        onChange={(item: { value: string; label: string }) => handleDomainSelect(item.value)}
      />

      <TouchableOpacity
        style={[styles.checkButton, { backgroundColor: selectedDomain ? '#28a745' : '#ccc' }]}
        onPress={handleCheckCompatibility}
        disabled={!selectedDomain}
      >
        <Text style={styles.checkButtonText}>Check Compatibility</Text>
      </TouchableOpacity>

      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Mentor Name</Text>
            <Text style={styles.headerCell}>Email</Text>
            {showCompatibilityColumns && <Text style={styles.headerCell}>Domain</Text>}
            <Text style={styles.headerCell}>Designation</Text>
            <Text style={styles.headerCell}>Tech Stack</Text>
            {showCompatibilityColumns && <Text style={styles.headerCell}>Score</Text>}
            {showCompatibilityColumns && <Text style={styles.headerCell}>Actions</Text>}
            {showCompatibilityColumns && <Text style={styles.headerCell}>Comments</Text>}
          </View>

          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMentorRow}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  dropdown: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  checkButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  checkButtonText: { color: '#FFF', fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#444',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  headerCell: {
    width: COLUMN_WIDTH,
    color: '#FFF',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#333'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  cell: {
    width: COLUMN_WIDTH,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#EEE',
    color: '#333'
  },
  actionText: {
    color: '#007BFF',
    fontWeight: 'bold'
  }
});

export default MenteeDashboard;