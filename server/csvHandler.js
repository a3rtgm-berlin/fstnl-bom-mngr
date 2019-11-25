const d3 = require('../node_modules/d3');
const ArbMatrix = require('./models/arbMatrix');
const ExcludeList = require('./models/excludeList');
const mat = require('./models/material');
const dsv = d3.dsvFormat(";");
const getTrainsRemaining = require('./projectsHandler').getTrainsRemaining;

async function csvToJson (csv, project) {
    var arbMatrix = null,
        excludeList = [],
        trainsPending;

    let promiseMatrix = new Promise((res, rej) => {
        ArbMatrix.findOne({}, (err, data) => {
            if (err) return console.error(err);
    
            res(data);
        });
    });

    let promiseExcludeList = new Promise((res, rej) => {
        ExcludeList.findOne({}, (err, data) => {
            if (err) return console.error(err);
            res(data);
        });
    });

    arbMatrix = await promiseMatrix;
    excludeList = await promiseExcludeList;
    trainsPending = await getTrainsCount(project);


    const json = dsv.parse(csv, (d) => {
        return filterData(d, arbMatrix.json, excludeList.exclude, trainsPending);
    });

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

function filterData (d, arbMatrix, excludeList, trainsPending) {
    var catId = "",
        catName = "";

    if (d.ArbPlatz === "INV") {
        catId = d["MaterialP"];
        catName = d["Objektkurztext"];
    } else {
        if (!excludeList.includes(d["MaterialP"])) {
            if (d.SchGut === "X") {
                if (d.MArt === "ROH" || d.MArt === "HALB") {
                    return new mat.Item(d, catId, catName, arbMatrix, trainsPending);
                }
            }
        }
    }
    return;
}

module.exports = { csvToJson };