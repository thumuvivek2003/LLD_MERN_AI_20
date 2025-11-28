import React, { useState, useEffect } from 'react';
import studentService from '../services/student.service';
import courseService from '../services/course.service';
import marksService from '../services/marks.service';
import attendanceService from '../services/attendance.service';
import { Link } from "react-router-dom";

function Dashboard({ role }) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        averageAttendance: '0%',
        averageMarks: '0%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role === "Admin" || role === "Teacher") {
            fetchDashboardStats();
        } else {
            setLoading(false);
        }
    }, [role]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            const [studentsRes, coursesRes, marksRes, attendanceRes] = await Promise.all([
                studentService.getAllStudents(),
                courseService.getAllCourses(),
                marksService.getAllMarks(),
                attendanceService.getAllAttendance()
            ]);

            let avgMarks = 0;
            if (marksRes.data.length > 0) {
                const totalPercentage = marksRes.data.reduce((sum, mark) => {
                    return sum + (mark.marks / mark.maxMarks) * 100;
                }, 0);
                avgMarks = (totalPercentage / marksRes.data.length).toFixed(2);
            }

            let avgAttendance = 0;
            if (attendanceRes.data.length > 0) {
                const presentCount = attendanceRes.data.filter(
                    (record) => record.status === 'Present'
                ).length;
                avgAttendance = ((presentCount / attendanceRes.data.length) * 100).toFixed(2);
            }

            setStats({
                totalStudents: studentsRes.data.length,
                totalCourses: coursesRes.data.length,
                averageAttendance: `${avgAttendance}%`,
                averageMarks: `${avgMarks}%`
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        { title: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: 'bg-blue-500' },
        { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-green-500' },
        { title: 'Average Attendance', value: stats.averageAttendance, icon: '📅', color: 'bg-yellow-500' },
        { title: 'Average Marks', value: stats.averageMarks, icon: '📝', color: 'bg-purple-500' }
    ];

    const renderQuickActions = () => {
        if (role === "Admin") {
            return (
                <>
                    <Link to="/students" className="bg-indigo-500 text-white p-4 rounded-lg text-center">Manage Students</Link>
                    <Link to="/courses" className="bg-green-500 text-white p-4 rounded-lg text-center">Manage Courses</Link>
                    <Link to="/attendance" className="bg-yellow-500 text-white p-4 rounded-lg text-center">Attendance</Link>
                    <Link to="/marks" className="bg-purple-500 text-white p-4 rounded-lg text-center">Enter Marks</Link>
                </>
            );
        }

        if (role === "Teacher") {
            return (
                <>
                    <Link to="/attendance" className="bg-yellow-500 text-white p-4 rounded-lg text-center">Attendance</Link>
                    <Link to="/marks" className="bg-purple-500 text-white p-4 rounded-lg text-center">Enter Marks</Link>
                </>
            );
        }

        if (role === "Student") {
            return (
                <>
                    <Link to="/my-marks" className="bg-purple-500 text-white p-4 rounded-lg text-center">View My Marks</Link>
                    <Link to="/my-attendance" className="bg-yellow-500 text-white p-4 rounded-lg text-center">View My Attendance</Link>
                </>
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Dashboard ({role})
            </h2>

            {/* ✅ Show Stats ONLY for Admin & Teacher */}
            {(role === "Admin" || role === "Teacher") && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">System connected to backend API</span>
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <span className="text-blue-500">📝</span>
                            <span className="text-gray-700">Real-time data synchronization active</span>
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <span className="text-yellow-500">📊</span>
                            <span className="text-gray-700">Dashboard statistics updated</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {renderQuickActions()}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
