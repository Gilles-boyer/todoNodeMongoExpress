const Priority = require('../Models/Priorityes.model');

module.exports.index = async(req, res) => {
    Priority
        .find()
        .populate({ path: "tasks" })
        .then(priority => {
            res.json(priority);
        })
        .catch(err => { console.log(err) });
}

module.exports.list = async(req, res) => {
    Priority
        .find()
        .then(priority => {
            res.json(priority);
        })
        .catch(err => { console.log(err) });
}

module.exports.store = (req, res) => {
    if (req.method == 'POST') {
        var priority = new Priority({
            label: req.body.label
        });
        priority.save((err, priority) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(priority);
        });
    }
}

module.exports.delete = async(req, res, next) => {
    const priority = await Priority.findById(req.params.id).exec();

    await priority.delete();

    return res.status(200).json({
        response: "supprimé"
    });
}