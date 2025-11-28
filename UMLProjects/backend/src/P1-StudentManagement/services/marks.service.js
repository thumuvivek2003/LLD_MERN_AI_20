import Marks from '../models/marks.model.js';

class MarksService {
  async getAllMarks() {
    return await Marks.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });
  }

  async getMarksById(id) {
    const marks = await Marks.findById(id)
      .populate('studentId', 'name email')
      .populate('courseId', 'name code');
    if (!marks) {
      throw new Error('Marks record not found');
    }
    return marks;
  }

  async createMarks(marksData) {
    return await Marks.create(marksData);
  }

  async updateMarks(id, marksData) {
    const marks = await Marks.findByIdAndUpdate(
      id,
      marksData,
      { new: true, runValidators: true }
    );
    if (!marks) {
      throw new Error('Marks record not found');
    }
    return marks;
  }

  async deleteMarks(id) {
    const marks = await Marks.findByIdAndDelete(id);
    if (!marks) {
      throw new Error('Marks record not found');
    }
    return marks;
  }

  async getMarksByStudentId(studentId) {
    return await Marks.find({ studentId })
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });
  }

  async getMarksByCourseId(courseId) {
    return await Marks.find({ courseId })
      .populate('studentId', 'name email')
      .sort({ marks: -1 });
  }

  async getMarksByStudentAndCourse(studentId, courseId) {
    return await Marks.find({ studentId, courseId });
  }

  async calculateStudentAverage(studentId) {
    const marks = await Marks.find({ studentId });
    if (marks.length === 0) return 0;

    const totalPercentage = marks.reduce((sum, mark) => {
      return sum + (mark.marks / mark.maxMarks) * 100;
    }, 0);

    return (totalPercentage / marks.length).toFixed(2);
  }
}

export default new MarksService();