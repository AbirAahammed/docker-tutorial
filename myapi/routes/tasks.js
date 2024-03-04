var express = require('express');
const { post } = require('./users');
var router = express.Router();
const Task = require('../models/Task');
var router = express.Router();


router.get('/', function (req, res, next) {
    Task.findAll({
        attributes: [
            "id",
            "description",
        ], 
        raw : true}).then(data => res.json(data)
    )
})

router.put('/', function (req, res, next) {
    console.log("=====================================================================")
    console.log(req.body)
    console.log("=====================================================================")
    try {
        Task.create(req.body);
    } catch (error) {
        console.log(error)
    }

    res.sendStatus(201)
})


module.exports = router;
