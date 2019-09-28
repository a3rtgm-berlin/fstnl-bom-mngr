const IncomingForm = require('../node_modules/formidable').IncomingForm;
const FileReader = require('../node_modules/filereader');
const fs = require('../node_modules/file-system');
const path = require('../node_modules/path');
const parser = require('./xlsParser');
const csvHandler = require('./csvHandler');
// DB Models
const MaterialList = require("./models/list").MaterialListModel;

const reader = new FileReader();

const uploadDir = "./user-upload/";

function bom(req, res) {
    let form = new IncomingForm();

    form.on('file', (field, file) => {
        // Parse & Save to Disk
        reader.readAsArrayBuffer(file)
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);

            // retrieve data as {json: obj, csv: string, date: string, uploadDate: Date}
            let newDatum = parser(reader.result);
            newDatum.name = file.name;

            // save files to server dir
            fs.writeFile(path.join(uploadDir, file.name), view);
            fs.writeFile(path.join(uploadDir, `${file.name}.csv`), newDatum.csv);

            // send csv to csvHandler and wait for resolution
            // return the new data-object
            // send the json back to the client as response
            addJson(newDatum).then((data) => {
                dbModel = new MaterialList(data);
                dbModel.save();

                res.send(203, [data.id]);
            });
        });
    });

    
    form.on('end', (data) => {});

    form.parse(req);
};

async function addJson (datum) {
    // wait for the d3.dsv-handler to filter and convert the csv-string
    let promise = new Promise ((res, rej) => {
        res(csvHandler.csvToJson(datum.csv));
    });
    datum.json = await promise;

    return datum;
}

function matrix (req, res) {
    let form = new IncomingForm();

    form.on('file', (file) => {
        // Parse & save to disk
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);

            console.log(view);
            fs.writeFile(path.join(uploadDir, '/arb-matrix/', file.name), view);
        });
    });
}

module.exports = {bom, matrix};