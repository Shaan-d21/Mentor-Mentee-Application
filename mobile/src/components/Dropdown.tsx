import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps {
  data: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  direction?: 'up' | 'down';
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  direction = 'down',
}) => {
  return (
    <View style={styles.container}>
      <Dropdown
        
        style={styles.dropdown}
        dropdownPosition={direction === 'up' ? 'top' : 'bottom'}
        maxHeight={300}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={(item) => onSelect(item.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});

export default DropdownComponent;