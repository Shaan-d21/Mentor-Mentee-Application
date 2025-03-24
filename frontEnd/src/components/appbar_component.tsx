import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useDrawer } from '../context/drawer_context';


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10, 
        backgroundColor: '#FFFFFF', // White background
        borderBottomWidth: 1, // Subtle border
        borderBottomColor: '#E0E0E0',
    },
    icon: {
        padding: 10, // Increased padding
    },
});

interface Props {
    openDrawer: () => void;
    onProfilePress: () => void;
}

const AppBar: React.FC<Props> = ({ openDrawer, onProfilePress }) => {
      const { isDrawerOpen, toggleDrawer } = useDrawer();
    

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.icon}>
                <FontAwesomeIcon icon={faBars} size={24} color="#333333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onProfilePress} style={styles.icon}>
                <FontAwesomeIcon icon={faUserCircle} size={24} color="#333333" />
            </TouchableOpacity>
        </View>
    );
};

export default AppBar;