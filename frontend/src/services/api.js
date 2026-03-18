import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:8000',
    headers:{'Content-Type':'application/json'}
})

//Attach token to every request

api.interceptors.request.use((config) =>  {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = 'Bearer ${token}'
    return config
})

export const authAPI = {
    signup: (data) => api.post('/api/auth/signup',data),
    login: (data) => api.post('/api/auth/login',data),
}

export default api