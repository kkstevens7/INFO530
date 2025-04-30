var express = require('express');
var router = express.Router();

// Basic route
router.get('/', function(req, res, next) {
  res.send('Welcome to the Student Dashboard API');
});

module.exports = router;
