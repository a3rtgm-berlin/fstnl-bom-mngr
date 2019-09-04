const d3 = require('../node_modules/d3');
const mat = require('./models/material');
const dsv = d3.dsvFormat(";");

async function csvToJson (csv) {
    var catId = "",
        catName = "";

    return dsv.parse(csv, (d) => {
        return filterData(d);
    });
}

function filterData (d) {
    if (d.ArbPlatz === "INV") {
        catId = d["Material P"];
        catName = d["Objektkurztext"];
    } else {
        if (d.SchGut === "X") {
            if (d.MArt === "ROH" || d.MArt === "HALB") {
                return new mat.Item(d, catId, catName);
            }
        }
    }
    return;
}

module.exports = { csvToJson };