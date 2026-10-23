import express from 'express';
import studentController from '../controllers/student.controller.js';

const router = express.Router();

// GET all students
router.get('/', studentController.getAllStudents);

// GET student by ID
router.get('/:id', studentController.getStudentById);

// POST create new student
router.post('/', studentController.createStudent);

// PUT update student
router.put('/:id', studentController.updateStudent);

// DELETE student
router.delete('/:id', studentController.deleteStudent);

// GET search students
router.get('/search/query', studentController.searchStudents);

// GET students by status
router.get('/status/:status', studentController.getStudentsByStatus);

export default router;