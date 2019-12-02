const MaterialList = require("./models/list").MaterialListModel;
const Project = require("./models/project").ProjectModel;
const MasterBom = require('./models/masterBom');
const RPNModel = require('./models/rpn').RPNModel;
const projectHandler = require('./projectsHandler');
const template = require('./rpn.template.json');

module.exports = async function createRpn(req, res) {
    var rpn,
        id = req.params.id,
        master = await MasterBom.findOne({id: id}).exec(),
        projectsRegex = master.projects.map(tag => new RegExp(tag)),
        boms = await MaterialList.find({
            $and: [
                {id: {$regex: id}},
                {id: {$in: projectsRegex}}
            ]
        }).exec(),
        allParts = master.json
            .reduce((res, part) => {
                return res.includes(part.Material) ? res : [...res, part.Material];
            }, [])
            .map(part => {
                const map = {
                    id: part,
                    name: '',
                    unit: '',
                    ovCount: 0,
                    monthlyCount: 0,
                    phaseOutDate: '',
                    projects: []
                };
                master.projects.forEach(p => {
                    map[p] = 0;
                });

                return map;
            }),
        projects = await Project.find({tag: {$in: master.projects}}).exec();
        meta = template;

    projects.forEach(project => {
        var weeks = setWeeksTotal(project.created, project.deadline);

        meta[0][project.tag] = setWeeksLeft(project.deadline);
        meta[1][project.tag] = setTrainsPerWeek(project.trainsCount, weeks);
        meta[2][project.tag] = project.trainsCount;
    });

    boms.forEach(bom => {
        const project = bom.project;

        bom.json.forEach(item => {
            const match = allParts.find(part => part.id === item.Material);

            if (match) {
              match.ovCount += item.Menge;
              match.name = item.Objektkurztext;
              match.unit = item.ME;
              match[project] = match[project] ? match[project] + item.Menge : item.Menge;
            }
        });
    });

    allParts.forEach(part => {
        projects.forEach(project => {
            if (part[project.tag] > 0) {
                part.projects.push(project.tag);
                if (project.deadline > part.phaseOutDate) {
                    part.phaseOutDate = project.deadline;
                    part.monthlyCount += (part[project.tag] / meta[0][project.tag]) * 4;
                }
            }
        });
    });

    const RPN = new RPNModel({
        id: id,
        parts: [...meta, ...allParts]
    });

    RPN.save((err, rpn) => {
        if (err) {
            res.sendStatus(503);
            return console.error(err);
        }
        master.rpn = true;
        master.save();

        res.send(rpn);
    });
};

function setWeeksTotal (dateA, dateB) {
    const date1 = new Date(dateA);
    const date2 = new Date(dateB);

    let diffInWeeks = (date2.getTime() - date1.getTime()) / 1000;
    diffInWeeks /= (60 * 60 * 24 * 7);

    const totalWeeks = Math.abs(Math.round(diffInWeeks));

    return totalWeeks;
}

function setWeeksLeft (date) {
    const date1 = new Date(date);
    const date2 = new Date();

    let diffInWeeks = (date2.getTime() - date1.getTime()) / 1000;
    diffInWeeks /= (60 * 60 * 24 * 7);

    return Math.abs(Math.round(diffInWeeks));
}

function setTrainsPerWeek (trainCount, overallWeeks) {
    return Math.round((trainCount / overallWeeks) * 100) / 100;
}