var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('./db');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enrollmentRouter = require('./routes/enrollment');

var app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL (change as needed)
  methods: ['GET', 'POST'],
}));

// view engine setup (if using views, optional for REST API)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/enrollment', enrollmentRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) return res.sendStatus(401); // Unauthorized if no token
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token invalid
    req.user = user;
    next();
  });
};

// Login route example (you can move this to a separate `routes/users.js` later)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM students WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare hashed password
    bcrypt.compare(password, result[0].password, (err, match) => {
      if (err || !match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ studentId: result[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
      res.json({ token });

 // Ensure the app is listening to port 3000
const PORT = process.env.PORT || 3000; // Default to 3000 if not set in .env
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    });
  });
});

module.exports = app;
