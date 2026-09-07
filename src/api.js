import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REPLACE THIS WITH YOUR COMPUTER'S ACTUAL IP ADDRESS
// const BASE_URL = 'http://192.168.0.25:5000/api'; 
// const BASE_URL = 'http://10.10.50.195:5000/api'; 
const BASE_URL = 'https://mega-admin-backend.onrender.com/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

// This "Interceptor" automatically attaches the JWT token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;