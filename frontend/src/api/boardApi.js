import axios from 'axios';

const API_URL = 'http://localhost:3000/api/boards';

const boardApi = {
    createBoard: async (title, description) => {
        try {
            const response = await axios.post(`${API_URL}/create`, { title, description }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error creating board:', error);
            throw new Error('Internal server error', error);
        }
    },

    updateBoard: async (boardId, title, description) => {
        try {
            const response = await axios.put(`${API_URL}/update/${boardId}`, { title, description }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error updating board:', error);
            throw new Error('Internal server error', error);
        }
    },

    deleteBoard: async (boardId) => {
        try {
            await axios.delete(`${API_URL}/delete/${boardId}`, null, { withCredentials: true });
            return true;
        } catch (error) {
            console.error('Error deleting board:', error);
            throw new Error('Internal server error', error);
        }
    },

    getBoardsByUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error getting boards by user:', error);
            throw new Error('Internal server error', error);
        }
    },
};

export default boardApi;

