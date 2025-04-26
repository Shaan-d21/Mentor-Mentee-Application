import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    marginTop: 16,
    flexDirection: 'column',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  profileImageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    overflow: 'hidden',
  },
  infoContainer: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  profileInfoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    height:50,
    width:'100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 5,
  },
  
  disabledInput: {
    color: '#666',
  },
  domainsContainer: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  domainsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  icon: {
    fontWeight: 'bold',
    width: 10,
    height: 20,
    lineHeight: 16,
    paddingLeft: 25,
    textAlign: 'right',
    
  },
  
  emptySkillsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptySkillsText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
    textAlign: "center",
  },
  skillText: {
    color: '#333',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    backgroundColor: '#7f8c8d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 30,
  },
});

export const mentorSpecificStyles = StyleSheet.create({
  skillLevel: {
    backgroundColor: '#3498db',
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginLeft: 10,
    borderRadius: 10,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownField: {
    flex: 1,
    marginLeft: 0,
  },

  // Radio button container
  radioContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#3498db',
    marginRight: 4,
  },
  radioCircleSelected: {
    backgroundColor: '#3498db',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',               // <-- wider modal
    maxHeight: '100%',           // <-- taller modal
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  proficiencyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
    borderRadius: 5,
  },
  proficiencyText: {
    color: '#fff',
    fontSize: 16,
  },
  // ...existing code...
expandableSkillItem: {
  backgroundColor: '#fff',
  borderRadius: 8,
  marginBottom: 10,
  padding: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 1,
  elevation: 1,
},
expandableSkillHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
selectedLevelBadge: {
  backgroundColor: '#3498db',
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 2,
  marginLeft: 10,
},
selectedLevelText: {
  color: '#fff',
  fontSize: 12,
},
levelButtonRow: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginTop: 10,
},
levelButton: {
  backgroundColor: '#ecf0f1',
  borderRadius: 8,
  paddingVertical: 6,
  paddingHorizontal: 16,
  marginRight: 10,
},
levelButtonSelected: {
  backgroundColor: '#3498db',
},
levelButtonText: {
  color: '#333',
  fontWeight: 'bold',
},
levelButtonTextSelected: {
  color: '#fff',
},
});
