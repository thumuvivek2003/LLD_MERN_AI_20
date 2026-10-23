import courseService from '../services/course.service.js';

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchCourses(req, res, next) {
    try {
      const courses = await courseService.searchCourses(req.query.q);
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCoursesByStatus(req, res, next) {
    try {
      const courses = await courseService.getCoursesByStatus(req.params.status);
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseByCode(req, res, next) {
    try {
      const course = await courseService.getCourseByCode(req.params.code);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();