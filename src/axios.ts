import axios from 'axios'

export const apiClient = axios.create({
    baseURL: (window as any).__API_URL__ || import.meta.env.VITE_API_URL,
    timeout: 100000,
    withCredentials: true
})