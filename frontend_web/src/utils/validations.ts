export const validateName = (name: string): { isValid: boolean; error: string } => {
  if (!name) {
    return { isValid: false, error: 'Name cannot be empty' };
  }
  
  if (name.length < 2 || name.length > 50) {
    return { isValid: false, error: 'Name must be between 2-50 characters' };
  }
  
  // if (name.startsWith(' ') || name.endsWith(' ')) {
  //   return { isValid: false, error: 'Name cannot start or end with space' };
  // }
  
  // if (/\s{2,}/.test(name)) {
  //   return { isValid: false, error: 'Name cannot have more than one space between characters' };
  // }
  
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return { isValid: false, error: 'Name must only contain letters and spaces' };
  }
  
  return { isValid: true, error: '' };
};

export const validateContact = (contact: string): { isValid: boolean; error: string } => {
  if (!contact) {
    return { isValid: false, error: 'Contact number cannot be empty' };
  }
  
  if (!/^\d*$/.test(contact)) {
    return { isValid: false, error: 'Contact number cannot contain letters' };
  }
  
  if (contact.length < 10) {
    return { isValid: false, error: 'Contact number must be 10 digits' };
  }
  
  if (contact.length > 10) {
    return { isValid: false, error: 'Contact number cannot exceed 10 digits' };
  }
  
  return { isValid: true, error: '' };
};

export const validateDesignation = (designation: string): { isValid: boolean; error: string } => {
  if (!designation) {
    return { isValid: false, error: 'Designation cannot be empty' };
  }
  
  // if (designation.startsWith(' ') || designation.endsWith(' ')) {
  //   return { isValid: false, error: 'Designation cannot start or end with space' };
  // }
  
  // if (/\s{2,}/.test(designation)) {
  //   return { isValid: false, error: 'Designation cannot have more than one space between characters' };
  // }
  
  if (/^\d+$/.test(designation)) {
    return { isValid: false, error: 'Designation cannot be only numbers' };
  }
  
  return { isValid: true, error: '' };
};

export const validateExperience = (experience: number): { isValid: boolean; error: string } => {
  if (experience === 0) {
    return { isValid: false, error: 'Experience cannot be zero' };
  }
  
  if (experience < 0) {
    return { isValid: false, error: 'Experience cannot be negative' };
  }
  
  if (experience > 50) {
    return { isValid: false, error: 'Experience must be less than 50 years' };
  }
  
  return { isValid: true, error: '' };
}; 