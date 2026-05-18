import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const boardApi = {
    createBoard: async (title, description) => {
        try {
            const response = await axios.post(`${API_URL}/boards`, { title, description });
            return response.data;
        } catch (error) {
            console.error('Error creating board:', error);
            throw new Error('Internal server error', error);
        }
    },
    
    updateBoard: async (boardId, title, description) => {
        try {
            const response = await axios.put(`${API_URL}/boards/${boardId}`, { title, description });
            return response.data;
        } catch (error) {
            console.error('Error updating board:', error);
            throw new Error('Internal server error', error);
        }
    },
    
    deleteBoard: async (boardId) => {
        try {
            await axios.delete(`${API_URL}/boards/${boardId}`);
            return true;
        } catch (error) {
            console.error('Error deleting board:', error);
            throw new Error('Internal server error', error);
        }
    },
};

export default {boardApi};

