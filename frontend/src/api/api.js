import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8900/api',
  withCredentials: true // if using cookies
});

export default API;