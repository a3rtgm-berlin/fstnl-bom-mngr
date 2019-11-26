const MaterialList = require("./models/list").MaterialListModel;
const Project = require("./models/project").ProjectModel;

function updatePartAmount(bom, res) {
    Project.findOne({tag: bom.project}, (err, project) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }

        bom.json.forEach((part) => {
            part.Menge = part.MengeProZug * project.trainsCount;
        });
        bom.save();
        res.json();
    });
}

module.exports = {
    updatePartAmount,
}