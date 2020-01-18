const XLSX = require('../node_modules/xlsx');


function xlsParser(input, tag, suffix = null) {
    const rangeToIgnore = {c:1, r:3};

    // load from buffer,
    const wb = XLSX.read(input);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Get range of BOM File
    const range = XLSX.utils.decode_range(ws['!ref']);
    range.s = rangeToIgnore;

    // retrieve date of file
    let date = ws['A1'].v;
    let index = date.indexOf(' ');
    date = index !== -1 ? date.substring(0, index) : date;
    let id = suffix ? tag + '-' + date.substring(6) + '-' + date.substring(3, 5) + '-' + suffix : tag + '-' + date.substring(6) + '-' + date.substring(3, 5);

    // Set new Range according to standard BOM File
    const newRange = XLSX.utils.encode_range(range);

    // Create new Worksheet from range
    const dataAsJson = XLSX.utils.sheet_to_json(ws, {range: newRange, raw: false});
    const newWs = XLSX.utils.json_to_sheet(dataAsJson);

    // encode as CSV
    let dataAsCsv = XLSX.utils.sheet_to_csv(newWs, {FS: ';'});

    // fix inconsistencies in column naming
    dataAsCsv = dataAsCsv.replace(dataAsCsv.substring(0, dataAsCsv.search(/\n/)), dataAsCsv.substring(0, dataAsCsv.search(/\n/)).replace(/\s/g, ""));

    return {id: id, name: "", project: tag, json: {}, csv: dataAsCsv, date: date, uploadDate: new Date()};
};

function matrixParser(input) {
    // load from buffer, 
    const wb = XLSX.read(input, {type:"array"});
    const ws = wb.Sheets['All'];

    // create JSON from sheet
    const dataAsJson = XLSX.utils.sheet_to_json(ws);

    dataAsJson.forEach((el) => {
        if (el['Arb. Platz']) {
            el.ArbPlatz = el['Arb. Platz'];
            delete el['Arb. Platz'];
        }
    });

    return dataAsJson;
}

function excludeListParser(input) {
        // load from buffer, 
        const wb = XLSX.read(input, {type:"array"});
        const ws = wb.Sheets[wb.SheetNames[0]];
    
        // create JSON from sheet
        const dataAsJson = XLSX.utils.sheet_to_json(ws);
    
        return dataAsJson.map(d => Object.values(d)[0].toString());
}

function consumptionParser(input) {
        const rangeToIgnore = {c:0, r:11};

        // load from buffer,
        const wb = XLSX.read(input, {type:"array"});
        const ws = wb.Sheets[wb.SheetNames[0]];

        // const dataAsJson = XLSX.utils.sheet_to_json(ws);

        // Get range of BOM File
        const range = XLSX.utils.decode_range(ws['!ref']);
        range.s = rangeToIgnore;
    
        // Set new Range according to standard BOM File
        const newRange = XLSX.utils.encode_range(range);

        // // Create new Worksheet from range
        const dataAsJson = XLSX.utils.sheet_to_json(ws, {range: newRange, raw: false})
            .map(part => ({
                id: part['Cust Part #'],
                usage: part['Usage']
            }));
    
        return dataAsJson;
}

function planogramParser(input) {
    // load from buffer,
    const wb = XLSX.read(input, {type:"array"});
    const ws = wb.Sheets[wb.SheetNames[0]];

    const dataAsJson = XLSX.utils.sheet_to_json(ws);

    dataAsJson.forEach(part => {
        part.position = part.position.split(',');
        part.position = part.position.map(pos => pos.trim());
        part.id = part.Station + part.Material;
    });

    return dataAsJson;
}

module.exports = { xlsParser, matrixParser, excludeListParser, consumptionParser, planogramParser };

