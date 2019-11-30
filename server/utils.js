const MaterialList = require("./models/list").MaterialListModel;
const Project = require("./models/project").ProjectModel;
const ExcludeList = require("./models/excludeList");
const ArbMatrix = require("./models/arbMatrix");

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

function updateExcludesAndMatrix(boms) {
    return new Promise(async (res, rej) => {
        try {
            var exclude = await ExcludeList.findOne({}).exec(),
                matrix = await ArbMatrix.findOne({}).exec();
            
            boms.forEach(bom => {
                bom.json = bom.json
                    .filter(part => !exclude.exclude.includes(part.Material))
                    .map(part => {
                        part.Station = this.mapMatrix(part.ArbPlatz, matrix.json);
                        part.id = part.Station + part.Material;
                        return part;
                    });
                mergeDuplicates(bom.json);
                MaterialList.findOneAndUpdate({id: bom.id}, {json: bom.json, updated: new Date()}, (err) => {
                    if (err) {
                        res.sendStatus(500);
                        console.err(err);
                    }
                });
            });
            setTimeout(() => {
                console.log('lists updated');
                res(true);
            }, 2500);
        } catch (e) {
            console.error(e);
            rej(false);
        }
    });
}

function mapMatrix(station, arbMatrix) {
    if (!station) return "No Location";
    if (!arbMatrix) return station;

    const map = arbMatrix.find((map) => map.ArbPlatz === station) ? arbMatrix.find((map) => map.ArbPlatz === station).Area : '!' + station;

    if (map === "Not Valid" || map === "(Leer)") return "No Location";
    return map;
}

function convertLocaleStringToNumber (x) {
    return parseFloat(x.trim().replace('.', '').replace(',', '.'));
}

function mergeDuplicates(json) {
    return json.reduce((cleanJson, part) => {
        match = cleanJson.find(_part => _part.id === part.id);
        if (match) {
            match.Menge += part.Menge;
            match.MengeProZug += part.MengeProZug;
            return cleanJson;
        } else {
            return [...cleanJson, part];
        }
    }, []);
}

module.exports = {
    updatePartAmount,
    updateExcludesAndMatrix,
    mapMatrix,
    convertLocaleStringToNumber,
    mergeDuplicates
}