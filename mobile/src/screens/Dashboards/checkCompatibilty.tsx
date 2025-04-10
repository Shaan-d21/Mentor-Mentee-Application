import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DomainOption {
  label: string;
  value: string;
}

const CheckCompatibility = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const domainOptions: DomainOption[] = [
    
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

  const handleDomainSelect = (item: DomainOption) => {
    setSelectedDomain(item.value);
  };

  const handleCheckCompatibility = () => {
    // Static functionality for now
    Alert.alert('Compatibility Check', `Checking compatibility for ${selectedDomain || 'selected domain'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Check Compatibility</Text>
      <Dropdown
        style={styles.dropdown}
        data={domainOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Domain"
        value={selectedDomain}
        onChange={item => handleDomainSelect(item)}
      />
      <TouchableOpacity
        style={[styles.button, selectedDomain ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={handleCheckCompatibility}
        disabled={!selectedDomain}
      >
        <Text style={styles.buttonText}>Check Compatibility</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#007BFF',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckCompatibility;