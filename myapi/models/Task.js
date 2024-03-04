const { Sequelize } = require('sequelize');

const {Model, DataTypes} = require('sequelize')

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: 'task-db',
    port: 3306,
    dialect: 'mysql'
});

class Task extends Model{ }
Task.def
Task.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull : false
    },
    isdeleted : {
        type : DataTypes.TINYINT,
        defaultValue : 0,
        allowNull : false
    }
}, {sequelize, modelName:'Task', tableName:'Task'})

Task.sync({force: true});

module.exports = Task