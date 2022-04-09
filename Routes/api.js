const { express, app } = require('../app');
var taskControler = require('../Controllers/Tasks.controllers');
var priorityControler = require('../Controllers/Priorityes.controllers');

app.use(express.urlencoded({
    extended: true
}))

//route api task
app.get('/api/task/all', taskControler.index);
app.post('/api/task/add', taskControler.store);
app.post('/api/task/update', taskControler.update);
app.get('/api/task/show/:id', taskControler.show);
app.get('/api/task/delete/:id', taskControler.delete);

//route api priority
app.get('/api/priority/all', priorityControler.index);
app.post('/api/priority/add', priorityControler.store);
app.get('/api/priority/delete/:id', priorityControler.delete);


module.exports = app;