import api from './api';

const marksService = {
  // Get all marks
  getAllMarks: async () => {
    try {
      const response = await api.get('/marks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get marks by student ID
  getMarksByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/marks/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get marks by course ID
  getMarksByCourseId: async (courseId) => {
    try {
      const response = await api.get(`/marks/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new marks entry
  createMarks: async (marksData) => {
    try {
      const response = await api.post('/marks', marksData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update marks
  updateMarks: async (id, marksData) => {
    try {
      const response = await api.put(`/marks/${id}`, marksData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete marks
  deleteMarks: async (id) => {
    try {
      const response = await api.delete(`/marks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default marksService;