import studentService from '../services/student.service.js';

class StudentController {
  async getAllStudents(req, res, next) {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentById(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.params.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req, res, next) {
    try {
      const student = await studentService.updateStudent(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req, res, next) {
    try {
      await studentService.deleteStudent(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchStudents(req, res, next) {
    try {
      const students = await studentService.searchStudents(req.query.q);
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentsByStatus(req, res, next) {
    try {
      const students = await studentService.getStudentsByStatus(
        req.params.status
      );
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();