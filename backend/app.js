const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM students WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err) return res.sendStatus(500);
      if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ studentId: result[0].id }, SECRET_KEY, { expiresIn: '2h' });
      res.json({ token });
    }
  );
});

// Get student info
app.get('/api/student', authenticateToken, (req, res) => {
  db.query('SELECT first_name, last_name FROM students WHERE id = ?', [req.user.studentId], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result[0]);
  });
});

// Get attendance
app.get('/api/attendance', authenticateToken, (req, res) => {
  db.query(
    'SELECT course_name, semester, start_date, end_date, total_classes, attended FROM attendances WHERE student_id = ?',
    [req.user.studentId],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.json(result);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on port ${PORT}'));
