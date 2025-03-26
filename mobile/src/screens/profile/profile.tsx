import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import AppBar from '../../components/appbar_component';

const ProfileScreen = () => {
  const [domains, setDomains] = useState(['Python', 'Python', 'Python', 'Python']);
  const [newDomain, setNewDomain] = useState('');

  const addDomain = () => {
    if (newDomain.trim()) {
      setDomains([...domains, newDomain]);
      setNewDomain('');
    }
  };

  const removeDomain = (index: number) => {
    const updatedDomains = domains.filter((_, i) => i !== index);
    setDomains(updatedDomains);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppBar onProfilePress={() => {}} openDrawer={() => {}} />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          />
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <TextInput style={styles.infoText} value="Surname Name" editable={false} />
          <TextInput style={styles.infoText} value="email@gmail.com" editable={false} />
          <TextInput style={styles.infoText} value="+919999999999" editable={false} />
          <TextInput style={styles.infoText} value="Male" editable={false} />
        </View>
      </View>

      <View style={styles.domainsContainer}>
        <TextInput style={styles.infoText} value="Promact Global PVT. LTD." editable={false} />
        <TextInput style={styles.infoText} value="Github Id : abcd@1234" editable={false} />

        <Text style={styles.domainsTitle}>Domains</Text>
        
        {/* Domains List */}
        <FlatList
          data={domains}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({ item, index }) => (
            <View style={styles.domainItem}>
              <Text style={styles.domainText}>{item}</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeDomain(index)}>
                <Text style={styles.removeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Add Domain Section */}
        <View style={styles.addDomainContainer}>
          <TextInput
            style={styles.addDomainInput}
            placeholder="Add Domain..."
            value={newDomain}
            onChangeText={setNewDomain}
          />
          <TouchableOpacity style={styles.addButton} onPress={addDomain}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 200,
    height: 250,
    marginBottom: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  infoText: {
    fontSize:18,
    backgroundColor: '#eee',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  domainsContainer: {
    marginBottom: 16,
  },
  domainsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  domainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
    margin: 4,
    borderRadius: 4,
  },
  domainText: {
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: 'red',
  },
  addDomainContainer: {
    fontSize:18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addDomainInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
