const IncomingForm = require('../node_modules/formidable').IncomingForm;
const FileReader = require('../node_modules/filereader');
const fs = require('../node_modules/file-system');
const path = require('../node_modules/path');
const parser = require('./xlsParser');
const csvHandler = require('./csvHandler');

const reader = new FileReader();

const uploadDir = "./user-upload/";

module.exports = function upload(req, res) {
    let form = new IncomingForm();

    form.on('file', (field, file) => {
        res.send(file);

        // Parse & Save to Disk
        reader.readAsArrayBuffer(file)
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);

            // retrieve data as {json: obj, csv: string, date: string, uploadDate: Date}
            const newDatum = parser(reader.result);

            // save files to server dir
            fs.writeFile(path.join(uploadDir, file.name), view);
            fs.writeFile(path.join(uploadDir, `${file.name}.csv`), newDatum.csv);

            csvHandler.csvToJson(newDatum.csv);
        });
    });

    form.on('end', () => {
        res.json();
    });

    form.parse(req);
};