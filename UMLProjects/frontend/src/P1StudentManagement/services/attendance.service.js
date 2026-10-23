import api from './api';

const attendanceService = {
  // Get all attendance records
  getAllAttendance: async () => {
    try {
      const response = await api.get('/attendance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by student ID
  getAttendanceByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/attendance/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by course ID
  getAttendanceByCourseId: async (courseId) => {
    try {
      const response = await api.get(`/attendance/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by date
  getAttendanceByDate: async (date) => {
    try {
      const response = await api.get(`/attendance/date/${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new attendance record
  createAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update attendance
  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await api.put(`/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete attendance
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default attendanceService;