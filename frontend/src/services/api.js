import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
}

export const vitalsAPI = {
  record: (data) => api.post('/api/vitals/', data),
  getAll: (patientId) => api.get(`/api/vitals/${patientId}`),
  getLatest: (patientId) => api.get(`/api/vitals/${patientId}/latest`),
}
export default api