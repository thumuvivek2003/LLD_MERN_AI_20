import Student from '../models/student.model.js';

class StudentService {
  async getAllStudents() {
    return await Student.find().sort({ createdAt: -1 });
  }

  async getStudentById(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async createStudent(studentData) {
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }
    return await Student.create(studentData);
  }

  async updateStudent(id, studentData) {
    const student = await Student.findByIdAndUpdate(
      id,
      studentData,
      { new: true, runValidators: true }
    );
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async deleteStudent(id) {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async searchStudents(query) {
    return await Student.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { course: { $regex: query, $options: 'i' } },
      ],
    });
  }

  async getStudentsByStatus(status) {
    return await Student.find({ status });
  }
}

export default new StudentService();