import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './.dashboard.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StudentDashboard = () => {
  const [attendances, setAttendances] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStudent = async () => {
      const res = await fetch('http://localhost:3000/api/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudent(data);
    };

    const fetchAttendance = async () => {
      const res = await fetch('http://localhost:3000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAttendances(data);
    };

    fetchStudent();
    fetchAttendance();
  }, []);

  const courseLabels = attendances.map(a => `${a.course_name} (${a.semester})`);
  const attendanceRates = attendances.map(a =>
    Math.round((a.attended / a.total_classes) * 100)
  );

  const chartData = {
    labels: courseLabels,
    datasets: [
      {
        label: 'Attendance %',
        data: attendanceRates,
        backgroundColor: '#4caf50'
      }
    ]
  };

  return (
    <div style={{ padding: 20 }}>
      {student && <h2>Welcome, {student.first_name} {student.last_name}</h2>}
      <h3>Course Attendance Overview</h3>
      <Bar data={chartData} />
      <h4>Details:</h4>
      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Semester</th>
            <th>Start</th>
            <th>End</th>
            <th>Total</th>
            <th>Attended</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((a, i) => (
            <tr key={i}>
              <td>{a.course_name}</td>
              <td>{a.semester}</td>
              <td>{a.start_date}</td>
              <td>{a.end_date}</td>
              <td>{a.total_classes}</td>
              <td>{a.attended}</td>
              <td>{Math.round((a.attended / a.total_classes) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;
