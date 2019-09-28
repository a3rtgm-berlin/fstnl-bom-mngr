const d3 = require('../node_modules/d3');
const ArbMatrix = require('./models/arbMatrix');
const mat = require('./models/material');
const dsv = d3.dsvFormat(";");

async function csvToJson (csv) {
    var catId = "",
        catName = "",
        arbMatrix = null;

    let promise = new Promise((res, rej) => {
        ArbMatrix.findOne({}, (err, data) => {
            if (err) return console.error(err);
    
            res(data);
        });
    });

    arbMatrix = await promise;

    return dsv.parse(csv, (d) => {
        return filterData(d, arbMatrix.json);
    });
}

function filterData (d, arbMatrix) {
    if (d.ArbPlatz === "INV") {
        catId = d["MaterialP"];
        catName = d["Objektkurztext"];
    } else {
        if (d.SchGut === "X") {
            if (d.MArt === "ROH" || d.MArt === "HALB") {
                return new mat.Item(d, catId, catName, arbMatrix);
            }
        }
    }
    return;
}

module.exports = { csvToJson };