const validateEmail = (email: string) => {
  // First check for .com.com pattern
  if (email.toLowerCase().includes('.com.com')) {
    return false;
  }
  
  // Then check the general email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}; 