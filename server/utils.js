const Bom = require("./models/bom");
const Project = require("./models/project").ProjectModel;
const ExcludeList = require("./models/exclude");
const ArbMatrix = require("./models/matrix");

function updateSingleBom(bom, res) {
    Project.findOne({tag: bom.project}, (err, project) => {
        if (err) {
            res.sendStatus(404);
            return console.error(err);
        }

        bom.json.forEach((part) => {
            part['Quantity Total'] = part['Quantity Per Train'] * project.trainsCount;
        });
        bom.save();
        res.json();
    });
}

async function updatePartAmount(json, tag) {
    return new Promise((res, rej) => {
        Project.findOne({tag: tag}, (err, project) => {
            if (err) {
                res.sendStatus(404);
                return console.error(err);
            }
    
            json.forEach((part) => {
                part['Quantity Total'] = part['Quantity Per Train'] * project.trainsCount;
            });
    
            res(json);
        });
    });
}

function updateExcludesAndMatrix(boms) {
    return new Promise(async (res, rej) => {
        try {
            var exclude = await ExcludeList.findOne({}).exec(),
                matrix = await ArbMatrix.findOne({}).exec();
            
            boms.forEach(async bom => {
                bom.json = bom.json
                    .filter(part => !exclude.exclude.includes(part.Part))
                    .map(part => {
                        part.Location = this.mapMatrix(part.ArbPlatz, matrix.json);
                        part.id = part.Station + part.Material;
                        return part;
                    });
                bom.json = await updatePartAmount(mergeDuplicates(bom.json), bom.project);
                Bom.findOneAndUpdate({id: bom.id}, {json: bom.json, updated: new Date()}, (err) => {
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

function mapMatrix(arbPlatz, arbMatrix) {
    if (!arbPlatz) return "No Location";
    if (!arbMatrix) return arbPlatz;

    const map = arbMatrix.find((map) => map.ArbPlatz === arbPlatz) ? arbMatrix.find((map) => map.ArbPlatz === arbPlatz).Location : '!' + arbPlatz;

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