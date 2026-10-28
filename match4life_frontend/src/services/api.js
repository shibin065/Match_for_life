import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

// Since the backend doesn't have token auth natively implemented in the models,
// we will simulate auth by passing user ID in headers or managing it in React state.
// In a real production app, you would add an Authorization header here.

export default api;
