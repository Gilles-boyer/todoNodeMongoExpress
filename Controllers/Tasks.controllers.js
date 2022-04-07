const Task = require('../Models/Tasks.model');
const path = require('path');

module.exports.index = (req, res, next) => {
    Task.find()
        .then(tasks => res.status(200).json(tasks))
        .catch(err => console.error(err));
}

module.exports.viewTask = (req, res, next) => {
    var path = __dirname.split("Controllers")
    res.sendFile(path.join("/public/task.html"));
}

module.exports.store = (req, res) => {
    if (req.method == 'POST') {
        var task = new Task({
            title: req.body.title
        });
        task.save((err, task) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(task);
        });
    }
}

module.exports.update = async(req, res, next) => {

    const task = await Task.findById(req.body.id).exec();

    await task.update({
        title: req.body.title
    });

    return res.status(200).json({ response: "modifié" })
}

module.exports.show = async(req, res, next) => {
    const task = await Task.findById(req.params.id).exec();

    return res.status(200).json(task);
}

module.exports.delete = async(req, res, next) => {
    const task = await Task.findById(req.params.id).exec();

    await task.delete();

    return res.status(200).json({
        response: "supprimé"
    });
}