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
import fetchMentors from '../../services/apimentordomain'; // Import the fetchMentors function

const COLUMN_WIDTH = 140;

const MenteeDashboard: FC<ScreenProps<'MenteeDashboard'>> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.login.name);
  const { mentorList } = useSelector((state: RootState) => state.menteeDashboard);

  const [selectedDomain, setSelectedDomain] = useState('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCompatibilityColumns, setShowCompatibilityColumns] = useState(false);

  const domainOptions = [
    { label: 'Programming Languages', value: 'Programming Languages' },
    { label: 'Database & Backend', value: 'Database & Backend' },
    { label: 'Cloud Computing', value: 'Cloud Computing' },
    { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
    { label: 'AI & ML', value: 'Artificial Intelligence & Machine Learning' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Software Development', value: 'Software Development' },
  ];

  useEffect(() => {
      const value = fetchMentors();
      console.log('Fetched mentors:', value);
    // Initially fetch all mentors (mocked compatibility API response)
    const response = {
      domain_mentors: [
        {
          name: 'Mentor Two',
          id: 102,
          mail: 'mentor2@example.com',
          designation: 'AI Researcher',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 78,
          reason:
            'Belongs to the AI/ML domain. Has strong skills in Deep Learning (advanced), Machine Learning (intermediate), and Generative AI (intermediate), which contribute to a high score with the domain bonus.'
        },
        {
          name: 'Alice AI',
          id: 103,
          mail: 'alice.ai@example.com',
          designation: 'AI Engineer',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason:
            'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
        },
        {
          name: 'Bob ML',
          id: 104,
          mail: 'bob.ml@example.com',
          designation: 'ML Researcher',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason:
            'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
        },
        {
          name: 'Mentor Three',
          id: 105,
          mail: 'mentor3@example.com',
          designation: 'None',
          domain: 'Artificial Intelligence & Machine Learning',
          score: 0,
          reason:
            'Belongs to the AI/ML domain, but has no matching skills, resulting in a base score of 0. No skills to evaluate.'
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
          reason:
            'Does not belong to the AI/ML domain. No skills to evaluate, resulting in a score of 0.'
        },
        {
          name: 'Diana Cyber',
          id: 107,
          mail: 'diana.cyber@example.com',
          designation: 'Cyber Analyst',
          domain: 'Database & Backend',
          score: 0,
          reason:
            'Does not belong to the AI/ML domain. No skills to evaluate, resulting in a score of 0.'
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
    setFilteredList(formattedMentors); // initially show all
  }, [dispatch]);

  const handleSendRequest = (_mentorId: number) => {
    if (!selectedDomain) {
      Alert.alert('Please select a domain');
      return;
    }
    Alert.alert('Request Sent');
    // dispatch(sendMentorRequest({ mentorId, domain: selectedDomain }, dispatch));
  };

  const handleCheckCompatibility = () => {
    setShowDropdown(true);
  };

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
    setShowCompatibilityColumns(true);

    const filtered = mentorList.filter((mentor) =>
      mentor.techStack.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
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
        <TouchableOpacity onPress={() => handleSendRequest(item.id)} style={styles.cell}>
          <Text style={styles.actionText}>{item.action}</Text>
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.checkButton} onPress={handleCheckCompatibility}>
        <Text style={styles.checkButtonText}>Check Compatibility</Text>
      </TouchableOpacity>

      {showDropdown && (
        <Dropdown
          style={styles.dropdown}
          data={domainOptions}
          labelField="label"
          valueField="value"
          value={selectedDomain}
          placeholder="Select Domain"
          onChange={(item: { value: string; label: string }) => handleDomainSelect(item.value)}
        />
      )}

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
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  checkButtonText: { color: '#FFF', fontWeight: 'bold' },

  // Table
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