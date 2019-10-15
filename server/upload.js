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
const MultiBom = require('./multiBom');

const uploadDir = "./user-upload/";

const processedBoms = new Set();

async function bom(req, res) {
    processedBoms.clear();

    let form = new IncomingForm(),
        tag;

    form.parse(req);

    form.on('field', (name, field) => {
        tag = field;
    });
    
    form.on('error', (err) => {
        console.error(err);
        res.sendStatus(500);
        throw err;
    })

    form.on('file', async (name, file) => {
        const reader = new FileReader();

        // Parse & Save to Disk
        reader.readAsArrayBuffer(file);

        const readFile = new Promise((res, rej) => {
            reader.onload = async (evt) => {
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
                res(await addJson(newDatum));
            };
        });

        const processedBom = await readFile;
        processedBoms.add(processedBom);

        saveBomAndUpdateProject(await readFile);
    });

    form.on('end', () => {
        res.json();
    });
}

async function addJson (datum) {
    // wait for the d3.dsv-handler to filter and convert the csv-string
    let promise = new Promise ((res, rej) => {
        res(csvHandler.csvToJson(datum.csv));
    });
    datum.json = await promise;

    return datum;
}

function matrix (req, res) {
    const reader = new FileReader();
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

async function saveBomAndUpdateProject(bom) {
    const dbModel = new MaterialList(await updateListId(bom));
    console.log(dbModel);

    const success = new Promise((res) => {
        dbModel.save((err) => {
            if (err) {
                console.error(err);
                res(false);
            }
    
            Project.findOne({tag: bom.project}, (err, project) => {
                if (err) throw err;
                if (project) {
                    project.bomLists.push(bom.id);
                    project.save();
                }
            });
    
            res(true);
        });
    });

    return await success;
}

async function updateListId (list) {
    
    const updateListId = new Promise((res, rej) => {
        MaterialList.find({id: { $regex: `.*${list.id}.*`}}, (err, data) => {
            if (err) return console.error(err);

            console.log(list.id);
            if (data && data.length > 0) {
                list.id = list.id + '-' + data.length;
            }

            console.log(list.id);
            res(list);
        });
    });

    return await updateListId;
}

module.exports = {bom, matrix};