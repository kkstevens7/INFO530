var express = require('express');
var router = express.Router();

// Example route
router.get('/', function(req, res, next) {
  res.send('Enrollment Route');
});

module.exports = router;
