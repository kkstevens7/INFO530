var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config(); // Load environment variables

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enrollmentRouter = require('./routes/enrollment');

var app = express();

// view engine setup (you can remove this if you're not using views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/enrollment', enrollmentRouter);

// Set up a route for the root path to verify the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Student Dashboard API');
});

// MySQL Connection
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1); // Exit process if DB connection fails
  }
  console.log('MySQL connected!');
});

// Authentication Middleware (example)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Error handling middleware (if no route is found)
app.use(function(req, res, next) {
  res.status(404).send('Route not found');
});

// Error handler middleware
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send('Internal Server Error');
});

// Listen on port 3000 or from environment variables
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

