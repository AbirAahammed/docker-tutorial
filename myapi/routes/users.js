var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ status: 'running' })
});


/* GET users listing. */
router.get('/env', function(req, res, next) {
  res.json({ 
    NODE_ENV: process.env.NODE_ENV,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USER: process.env.MYSQL_USER, 
  })
});

module.exports = router;
