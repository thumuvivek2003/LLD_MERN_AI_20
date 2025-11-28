import Course from '../models/course.model.js';

class CourseService {
  async getAllCourses() {
    return await Course.find().sort({ createdAt: -1 });
  }

  async getCourseById(id) {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async createCourse(courseData) {
    const existingCourse = await Course.findOne({ code: courseData.code });
    if (existingCourse) {
      throw new Error('Course with this code already exists');
    }
    return await Course.create(courseData);
  }

  async updateCourse(id, courseData) {
    const course = await Course.findByIdAndUpdate(
      id,
      courseData,
      { new: true, runValidators: true }
    );
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async deleteCourse(id) {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async searchCourses(query) {
    return await Course.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { instructor: { $regex: query, $options: 'i' } },
      ],
    });
  }

  async getCoursesByStatus(status) {
    return await Course.find({ status });
  }

  async getCourseByCode(code) {
    return await Course.findOne({ code: code.toUpperCase() });
  }
}

export default new CourseService();