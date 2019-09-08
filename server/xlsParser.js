const XLSX = require('../node_modules/xlsx');

const rangeToIgnore = {c:1, r:3};

module.exports = function xlsParser(input) {
    // load from buffer, 
    const wb = XLSX.read(input, {type:"array"});
    const ws = wb.Sheets[wb.SheetNames[0]];

    // retrieve date of file
    let date = ws['A1'].v;
    let index = date.indexOf(' ');
    date = date.substring(0, index);
    let id = date.substring(6) + '-' + date.substring(3, 5);

    // Get range of BOM File
    const range = XLSX.utils.decode_range(ws['!ref']);
    range.s = rangeToIgnore;

    // Set new Range according to standard BOM File
    const newRange = XLSX.utils.encode_range(range);

    // Create new Worksheet from range
    const dataAsJson = XLSX.utils.sheet_to_json(ws, {range: newRange});
    const newWs = XLSX.utils.json_to_sheet(dataAsJson);

    // encode as CSV
    const dataAsCsv = XLSX.utils.sheet_to_csv(newWs, {FS: ';'});

    return {id: id, json: {}, csv: dataAsCsv, date: date, uploadDate: new Date()};
}

