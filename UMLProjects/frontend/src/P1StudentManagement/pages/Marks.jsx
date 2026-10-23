import { useState, useEffect } from 'react';
import marksService from '../services/marks.service';
import studentService from '../services/student.service';
import courseService from '../services/course.service';

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    courseId: '',
    course: '',
    marks: '',
    maxMarks: '100',
    semester: '',
    academicYear: ''
  });

  useEffect(() => {
    fetchMarks();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const response = await marksService.getAllMarks();
      setMarks(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const grade = calculateGrade(
      Number(formData.marks),
      Number(formData.maxMarks)
    );

    const payload = {
      studentId: formData.studentId,
      studentName: formData.studentName,
      courseId: formData.courseId || null,
      course: formData.course,
      marks: Number(formData.marks),
      maxMarks: Number(formData.maxMarks),
      grade,
      semester: formData.semester,
      academicYear: formData.academicYear,
    };

    try {
      await marksService.createMarks(payload);

      alert('Marks added successfully ✅');

      setFormData({
        studentId: '',
        studentName: '',
        courseId: '',
        course: '',
        marks: '',
        maxMarks: '100',
        semester: '',
        academicYear: ''
      });

      setShowModal(false);
      fetchMarks();

    } catch (error) {
      console.error('Error saving marks:', error);
      alert(error.response?.data?.message || 'Failed to save marks');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this marks record?')) {
      try {
        await marksService.deleteMarks(id);
        fetchMarks();
      } catch (error) {
        console.error('Error deleting marks:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading marks...</div>;
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Marks</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
        >
          Add Marks
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Course</th>
              <th className="px-6 py-4 text-left">Marks</th>
              <th className="px-6 py-4 text-left">%</th>
              <th className="px-6 py-4 text-left">Grade</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {marks.map((mark, index) => (
              <tr key={mark._id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4">{mark.studentName}</td>
                <td className="px-6 py-4">{mark.course}</td>
                <td className="px-6 py-4">{mark.marks}/{mark.maxMarks}</td>
                <td className="px-6 py-4">{mark.percentage}%</td>
                <td className="px-6 py-4">{mark.grade}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(mark._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Add Marks
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Student Dropdown */}
              <select
                value={formData.studentId}
                onChange={(e) => {
                  const student = students.find(s => s._id === e.target.value);
                  setFormData({
                    ...formData,
                    studentId: student._id,
                    studentName: student.name
                  });
                }}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>

              {/* Course Dropdown */}
              <select
                value={formData.courseId}
                onChange={(e) => {
                  const course = courses.find(c => c._id === e.target.value);
                  setFormData({
                    ...formData,
                    courseId: course._id,
                    course: course.name
                  });
                }}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Marks Obtained"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Max Marks"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Semester (optional)"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Academic Year (optional)"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white p-2 rounded"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 p-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marks;
