import marksService from '../services/marks.service.js';

class MarksController {
  async getAllMarks(req, res, next) {
    try {
      const marks = await marksService.getAllMarks();
      res.status(200).json({
        success: true,
        count: marks.length,
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMarksById(req, res, next) {
    try {
      const marks = await marksService.getMarksById(req.params.id);
      res.status(200).json({
        success: true,
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMarks(req, res, next) {
    try {
      const marks = await marksService.createMarks(req.body);
      res.status(201).json({
        success: true,
        message: 'Marks created successfully',
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMarks(req, res, next) {
    try {
      const marks = await marksService.updateMarks(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Marks updated successfully',
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMarks(req, res, next) {
    try {
      await marksService.deleteMarks(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Marks deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMarksByStudentId(req, res, next) {
    try {
      const marks = await marksService.getMarksByStudentId(req.params.studentId);
      res.status(200).json({
        success: true,
        count: marks.length,
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMarksByCourseId(req, res, next) {
    try {
      const marks = await marksService.getMarksByCourseId(req.params.courseId);
      res.status(200).json({
        success: true,
        count: marks.length,
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }

  async calculateStudentAverage(req, res, next) {
    try {
      const average = await marksService.calculateStudentAverage(
        req.params.studentId
      );
      res.status(200).json({
        success: true,
        data: {
          studentId: req.params.studentId,
          averagePercentage: average,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MarksController();