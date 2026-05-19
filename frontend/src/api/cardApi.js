import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cards';

const cardApi = {
    createCard: async (columnId, title, description) => {
        try {
            const response = await axios.post(`${API_URL}/create`, { columnId, title, description  }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error creating card:', error);
            throw new Error('Internal server error', error);
        }
    },

    updateCard: async (cardId, title, description) => {
        try {
            const response = await axios.put(`${API_URL}/update/${cardId}`, { title, description }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error updating card:', error);
            throw new Error('Internal server error', error);
        }
    },

    deleteCard: async (cardId) => {
        try {
            await axios.delete(`${API_URL}/delete/${cardId}`, null, { withCredentials: true });
            return true;
        } catch (error) {
            console.error('Error deleting card:', error);
            throw new Error('Internal server error', error);
        }
    },

    moveCard: async (taskId, newColumnId, newPosition) => {
        try {
            const response = await axios.put(`${API_URL}/move/${taskId}`, { newColumnId, newPosition }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error moving card:', error);
            throw new Error('Internal server error', error);
        }
    },

    getCardsOnBoard: async (boardId) => {
        try {
            const response = await axios.get(`${API_URL}/board/${boardId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error getting cards on board:', error);
            throw new Error('Internal server error', error);
        }
    },
};

export default cardApi;