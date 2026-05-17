// frontend/src/api/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const authApi = {

    register: async (email, password, fullName) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { email, password, fullName });
            return response.data;
        } catch (error) {
            console.error("Error in register:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            return response.data;
        } catch (error) {
            console.error("Error in login:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    logout: async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            return response.data;
        } catch (error) {
            console.error("Error in logout:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    refreshToken: async () => {
        try {
            const response = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error in refreshToken:", error);
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default authApi;
