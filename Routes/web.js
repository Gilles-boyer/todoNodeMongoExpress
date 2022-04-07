const { express, app } = require('../app');
var taskControler = require('../Controllers/Tasks.controllers')
const path = require('path');

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('public'));

app.get("/task/:id", taskControler.viewTask)

module.exports = app;