import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentDashboard from './StudentDashboard_index';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
    </Routes>
  </Router>
  );
}

export default App;
