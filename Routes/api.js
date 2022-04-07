const { express, app } = require('../app');
var taskControler = require('../Controllers/Tasks.controllers');

app.use(express.urlencoded({
    extended: true
}))

app.get('/api/task/all', taskControler.index);

app.post('/api/task/add', taskControler.store);

app.post('/api/task/update', taskControler.update);

app.get('/api/task/show/:id', taskControler.show);

app.get('/api/task/delete/:id', taskControler.delete);

module.exports = app;