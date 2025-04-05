import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://e337-160-250-150-14.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... existing code ... 