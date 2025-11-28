import express from 'express';
import attendanceController from '../controllers/attendance.controller.js';

const router = express.Router();

// GET all attendance
router.get('/', attendanceController.getAllAttendance);

// GET attendance by ID
router.get('/:id', attendanceController.getAttendanceById);

// POST create new attendance
router.post('/', attendanceController.createAttendance);

// PUT update attendance
router.put('/:id', attendanceController.updateAttendance);

// DELETE attendance
router.delete('/:id', attendanceController.deleteAttendance);

// GET attendance by student ID
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);

// GET attendance by course ID
router.get('/course/:courseId', attendanceController.getAttendanceByCourseId);

// GET attendance by date
router.get('/date/:date', attendanceController.getAttendanceByDate);

// GET attendance percentage
router.get(
  '/student/:studentId/percentage',
  attendanceController.calculateAttendancePercentage
);

// GET attendance by date range
router.get('/range/dates', attendanceController.getAttendanceByDateRange);

export default router;