import Attendance from '../models/attendance.model.js';

class AttendanceService {
  async getAllAttendance() {
    return await Attendance.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'name code')
      .sort({ date: -1 });
  }

  async getAttendanceById(id) {
    const attendance = await Attendance.findById(id)
      .populate('studentId', 'name email')
      .populate('courseId', 'name code');
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  async createAttendance(attendanceData) {
    return await Attendance.create(attendanceData);
  }

  async updateAttendance(id, attendanceData) {
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      attendanceData,
      { new: true, runValidators: true }
    );
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  async deleteAttendance(id) {
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  async getAttendanceByStudentId(studentId) {
    return await Attendance.find({ studentId })
      .populate('courseId', 'name code')
      .sort({ date: -1 });
  }

  async getAttendanceByCourseId(courseId) {
    return await Attendance.find({ courseId })
      .populate('studentId', 'name email')
      .sort({ date: -1 });
  }

  async getAttendanceByDate(date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate('studentId', 'name email')
      .populate('courseId', 'name code');
  }

  async calculateAttendancePercentage(studentId, courseId = null) {
    const query = { studentId };
    if (courseId) query.courseId = courseId;

    const allRecords = await Attendance.find(query);
    if (allRecords.length === 0) return 0;

    const presentCount = allRecords.filter(
      (record) => record.status === 'Present'
    ).length;

    return ((presentCount / allRecords.length) * 100).toFixed(2);
  }

  async getAttendanceByDateRange(startDate, endDate) {
    return await Attendance.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('studentId', 'name email')
      .populate('courseId', 'name code')
      .sort({ date: -1 });
  }
}

export default new AttendanceService();