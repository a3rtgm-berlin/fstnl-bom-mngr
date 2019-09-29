const IncomingForm = require('../node_modules/formidable').IncomingForm;
const FileReader = require('../node_modules/filereader');
const fs = require('../node_modules/file-system');
const path = require('../node_modules/path');
const parser = require('./xlsParser');
const csvHandler = require('./csvHandler');
// DB Models
const MaterialList = require("./models/list").MaterialListModel;
const ArbMatrix = require('./models/arbMatrix');
const Project = require('./models/project').ProjectModel;

const reader = new FileReader();

const uploadDir = "./user-upload/";

async function bom(req, res) {
    let form = new IncomingForm(),
        tag;

    form.parse(req, (err, fields) => {
        if (err) return console.error(err);
        
        tag = fields.field;
    });

    form.on('file', (field, file) => {
        // Parse & Save to Disk
        reader.readAsArrayBuffer(file)
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);

            // retrieve data as {json: obj, csv: string, date: string, uploadDate: Date}
            let newDatum = parser.xlsParser(reader.result, tag);
            newDatum.name = file.name;

            // save files to server dir
            fs.writeFile(path.join(uploadDir, file.name), view);
            fs.writeFile(path.join(uploadDir, `${file.name}.csv`), newDatum.csv);

            // send csv to csvHandler and wait for resolution
            // return the new data-object
            // send the json back to the client as response
            addJson(newDatum).then((data) => {
                dbModel = new MaterialList(data);
                dbModel.save((err) => {
                    if (err) {
                        res.status(500).send(err);
                        return console.error(err);
                    }

                    Project.findOne({tag: tag}, (err, project) => {
                        if (err) throw err;

                        project.bomLists.push(data.id);
                        project.save(); 
                    });

                    res.status(203).send([data.id]);
                });
            });
        });
    });
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

    form.on('file', (field, file) => {
        // Parse & save to disk
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);
            const newMatrix = parser.matrixParser(reader.result);
            const matrixObj = {
                'json': newMatrix,
                'uploadDate': new Date()
            };
            const dbModel = new ArbMatrix(matrixObj);

            fs.writeFile(path.join(uploadDir, '/arb-matrix/', file.name), view);
            fs.writeFile(path.join(uploadDir, '/arb-matrix/', 'arbMatrix.json'), JSON.stringify(newMatrix));

            ArbMatrix.find((err, data) => {
                if (err) {
                    res.status(500).send(err);
                    return console.error(err);
                }

                if (data.length > 0) {
                    ArbMatrix.findOneAndUpdate({}, dbModel, {}, (err) => {
                        if (err) {
                            res.status(500).send(err);
                            return console.error(err);
                        }
                        res.status(203).send([file.name]);
                    });
                } else {
                    dbModel.save((err) => {
                        if (err) {
                            res.status(500).send(err);
                            return console.error(err);
                        }
                        res.status(203).send([file.name]);
                    });
                }
            });
        });
    });

    form.parse(req);
}

module.exports = {bom, matrix};