const d3 = require('../node_modules/d3');

function csvToJson (csv) {
    d3.dsv(';', csv, (d) => {
        console.log(d);
    });
}

module.exports = { csvToJson };