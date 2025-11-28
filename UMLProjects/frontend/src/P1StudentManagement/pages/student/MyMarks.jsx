import React, { useState, useEffect } from 'react';
import marksService from '../../services/marks.service';

function MyMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId") || '6929016d84ff425f8127edf3'; // from login later

  useEffect(() => {
    fetchMyMarks();
  }, []);

  const fetchMyMarks = async () => {
    try {
      setLoading(true);

      const response = await marksService.getMarksByStudentId(studentId);
      setMarks(response.data);

    } catch (error) {
      console.error('Error fetching my marks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading your marks...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Marks</h2>

      {marks.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          No marks found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>

            <tbody>
              {marks.map((mark) => (
                <tr key={mark._id} className="border-b">
                  <td className="px-4 py-3">{mark.course}</td>
                  <td className="px-4 py-3">{mark.marks}/{mark.maxMarks}</td>
                  <td className="px-4 py-3">{mark.percentage}%</td>
                  <td className="px-4 py-3 font-bold">{mark.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyMarks;
