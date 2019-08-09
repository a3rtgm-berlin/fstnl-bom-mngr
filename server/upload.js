const IncomingForm = require('../node_modules/formidable').IncomingForm;
const FileReader = require('../node_modules/filereader');
const fs = require('../node_modules/file-system');
const path = require('../node_modules/path');
const parser = require('./xlsParser');

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

            // Output
            dataAsCsv = parser(reader.result);

            fs.writeFile(path.join(uploadDir, file.name), view);
            fs.writeFile(path.join(uploadDir, "test.csv"), dataAsCsv);
        });
    });

    form.on('end', () => {
        res.json();
    });

    form.parse(req);
}