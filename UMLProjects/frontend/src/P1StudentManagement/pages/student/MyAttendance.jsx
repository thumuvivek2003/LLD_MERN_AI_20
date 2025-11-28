import React, { useState, useEffect } from 'react';
import attendanceService from '../../services/attendance.service';

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId") || '6929016d84ff425f8127edf3';

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);

      const response = await attendanceService.getAttendanceByStudentId(studentId);
      setAttendance(response.data);

    } catch (error) {
      console.error("Error fetching my attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Late": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading your attendance...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Attendance</h2>

      {attendance.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          No attendance found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-left">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border-b">
                  <td className="px-4 py-3">{record.course}</td>
                  <td className="px-4 py-3">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{record.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyAttendance;
