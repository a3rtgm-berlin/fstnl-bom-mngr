const IncomingForm = require('../node_modules/formidable').IncomingForm;
const Project = require("./models/project").ProjectModel;

const newProject = function(req, res, next) {
    let form = new IncomingForm();

    form.parse(req, (err, fields) => {
        if (err) return console.error(err);
        if (fields) {
            const dbModel = new Project(fields);
            dbModel.save();

            res.status(201).send([fields]);
        } else {
            res.sendStatus(500);
        }
    });
}

module.exports = { newProject }