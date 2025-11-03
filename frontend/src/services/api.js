import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
baseURL: API_URL,
headers: { 'Content-Type': 'application/json' },
});


// Auth
export const login = (username, password) => api.post('/auth/login', { username, password });


// Members
export const getMembers = () => api.get('/members');
export const addMember = (member) => api.post('/members', member);
export const updateMember = (id, member) => api.put(`/members/${id}`, member);
export const deleteMember = (id) => api.delete(`/members/${id}`);
export const searchMembers = (q) => api.get(`/members/search?q=${encodeURIComponent(q)}`);


// Payments
export const getPayments = () => api.get('/payments');
export const addPayment = (payment) => api.post('/payments', payment);
export const getDues = () => api.get('/payments/dues');


// Activities
export const getActivities = () => api.get('/activities');
export const triggerWhatsApp = (memberId, message) => api.post('/activities/whatsapp', { memberId, message });


export default api;