import express from 'express';
import marksController from '../controllers/marks.controller.js';

const router = express.Router();

// GET all marks
router.get('/', marksController.getAllMarks);

// GET marks by ID
router.get('/:id', marksController.getMarksById);

// POST create new marks
router.post('/', marksController.createMarks);

// PUT update marks
router.put('/:id', marksController.updateMarks);

// DELETE marks
router.delete('/:id', marksController.deleteMarks);

// GET marks by student ID
router.get('/student/:studentId', marksController.getMarksByStudentId);

// GET marks by course ID
router.get('/course/:courseId', marksController.getMarksByCourseId);

// GET student average
router.get('/student/:studentId/average', marksController.calculateStudentAverage);

export default router;