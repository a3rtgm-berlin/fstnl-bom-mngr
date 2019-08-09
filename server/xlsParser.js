// const Excel = require('../node_modules/exceljs');
const XLSX = require('../node_modules/xlsx');

module.exports = function xlsParser(input) {
    // load from buffer
    let wb = XLSX.read(input, {type:"array"});
    let ws = wb.Sheets[wb.SheetNames[0]];

    console.log(ws);

    delete_rows(ws, 0, 3);


    let dataAsJson = XLSX.utils.sheet_to_json(ws);
    let dataAsCsv = XLSX.utils.sheet_to_csv(ws);

    return dataAsCsv;
}

