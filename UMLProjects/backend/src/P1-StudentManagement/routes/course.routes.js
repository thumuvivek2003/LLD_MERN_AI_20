import express from 'express';
import courseController from '../controllers/course.controller.js';

const router = express.Router();

// GET all courses
router.get('/', courseController.getAllCourses);

// GET course by ID
router.get('/:id', courseController.getCourseById);

// POST create new course
router.post('/', courseController.createCourse);

// PUT update course
router.put('/:id', courseController.updateCourse);

// DELETE course
router.delete('/:id', courseController.deleteCourse);

// GET search courses
router.get('/search/query', courseController.searchCourses);

// GET courses by status
router.get('/status/:status', courseController.getCoursesByStatus);

// GET course by code
router.get('/code/:code', courseController.getCourseByCode);

export default router;