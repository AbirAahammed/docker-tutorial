var express = require('express');
const { post } = require('./users');
var router = express.Router();
const Task = require('../models/Task');
var router = express.Router();


router.get('/', function (req, res, next) {
    Task.findAll().then(data => console.log(data))
    res.json({ status: 'running' })
})

router.put('/', function (req, res, next) {
    Task.create(req.body);
    res.sendStatus(201)
})


module.exports = router;
