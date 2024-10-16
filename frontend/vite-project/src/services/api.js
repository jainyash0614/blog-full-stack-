import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.get('/auth/logout');
export const getCurrentUser = () => api.get('/auth/user');

export const createPost = (postData) => api.post('/posts', postData);
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, postData) => api.put(`/posts/${id}`, postData);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const likePost = (id) => api.post(`/posts/${id}/like`);
export const unlikePost = (id) => api.delete(`/posts/${id}/like`);
export const addComment = (id, content) => api.post(`/posts/${id}/comments`, { content });
export const getComments = (id) => api.get(`/posts/${id}/comments`);
export const getAudio = (id) => api.get(`/posts/${id}/audio`);

export default api;