import { useState, useEffect } from 'react';
import attendanceService from '../services/attendance.service';
import studentService from '../services/student.service';
import courseService from '../services/course.service';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    courseId: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: ''
  });

  useEffect(() => {
    fetchAttendance();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAllAttendance();
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: formData.studentId,
      studentName: formData.studentName,
      courseId: formData.courseId || null,
      course: formData.course,
      date: formData.date,
      status: formData.status,
      remarks: formData.remarks
    };

    try {
      await attendanceService.createAttendance(payload);
      alert('Attendance marked successfully ✅');

      setFormData({
        studentId: '',
        studentName: '',
        courseId: '',
        course: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        remarks: ''
      });

      setShowModal(false);
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);

      // Handles your unique index error nicely
      if (error.response?.data?.message?.includes('duplicate')) {
        alert('Attendance already exists for this student, course, and date!');
      } else {
        alert(error.response?.data?.message || 'Failed to save attendance');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceService.deleteAttendance(id);
        fetchAttendance();
      } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Failed to delete attendance');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-200 text-green-800';
      case 'Absent': return 'bg-red-200 text-red-800';
      case 'Late': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Attendance</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
        >
          Mark Attendance
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Remarks</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={record._id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4">{record.studentName}</td>
                    <td className="px-6 py-4">{record.course}</td>
                    <td className="px-6 py-4">{formatDate(record.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{record.remarks || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">

            <h3 className="text-2xl font-bold mb-6">Mark Attendance</h3>

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
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} - {s.email}
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
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              {/* Date */}
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              {/* Status */}
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>

              {/* Remarks */}
              <textarea
                placeholder="Remarks (optional)"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded"
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

export default Attendance;
