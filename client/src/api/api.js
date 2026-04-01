import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/store';

// const API = axios.create({
//     baseURL: 'http://localhost:5000/api',
// });

const getBaseURL = () => {
    const envURL = import.meta.env.VITE_API_BASE_URL;
    if (!envURL) return 'http://localhost:5000/api';
    
    // Ensure it ends with /api
    return envURL.endsWith('/api') ? envURL : `${envURL.replace(/\/$/, '')}/api`;
};

const API = axios.create({
    baseURL: getBaseURL(),
});


// Add a request interceptor to attach the JWT token
API.interceptors.request.use((req) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Add a response interceptor to handle unauthorized errors (401)
API.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
