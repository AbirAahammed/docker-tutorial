var express = require('express');
const { post } = require('./users');
var router = express.Router();
const Task = require('../models/Task');
const { NONE } = require('sequelize');
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
    if (req.body.id == undefined) {
        Task.create(req.body);
        res.sendStatus(201);
    }else {
        Task.update(
            req.body,
            { where: { id: req.body.id } }
          )
            .success(result =>
                res.sendStatus(200)
            )
            .error(err =>
                res.sendStatus(400)
            )
    }
})

router.delete('/:id', function(req, res, next){
    Task.destroy({
        where: {
            id: req.params.id
        }
    }).success(result =>
        res.sendStatus(200)
    )
    .error(err =>
        res.sendStatus(400)
    )
})

module.exports = router;
