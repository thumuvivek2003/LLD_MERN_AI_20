import attendanceService from '../services/attendance.service.js';

class AttendanceController {
  async getAllAttendance(req, res, next) {
    try {
      const attendance = await attendanceService.getAllAttendance();
      res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceById(req, res, next) {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);
      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAttendance(req, res, next) {
    try {
      const attendance = await attendanceService.createAttendance(req.body);
      res.status(201).json({
        success: true,
        message: 'Attendance created successfully',
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAttendance(req, res, next) {
    try {
      const attendance = await attendanceService.updateAttendance(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAttendance(req, res, next) {
    try {
      await attendanceService.deleteAttendance(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Attendance deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceByStudentId(req, res, next) {
    try {
      const attendance = await attendanceService.getAttendanceByStudentId(
        req.params.studentId
      );
      res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceByCourseId(req, res, next) {
    try {
      const attendance = await attendanceService.getAttendanceByCourseId(
        req.params.courseId
      );
      res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceByDate(req, res, next) {
    try {
      const attendance = await attendanceService.getAttendanceByDate(
        req.params.date
      );
      res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async calculateAttendancePercentage(req, res, next) {
    try {
      const { studentId } = req.params;
      const { courseId } = req.query;
      
      const percentage = await attendanceService.calculateAttendancePercentage(
        studentId,
        courseId
      );
      
      res.status(200).json({
        success: true,
        data: {
          studentId,
          courseId: courseId || 'all',
          attendancePercentage: percentage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const attendance = await attendanceService.getAttendanceByDateRange(
        startDate,
        endDate
      );
      res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();