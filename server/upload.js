const IncomingForm = require('../node_modules/formidable').IncomingForm;
const FileReader = require('../node_modules/filereader');
const fs = require('../node_modules/file-system');
const path = require('../node_modules/path');
const parser = require('./xlsParser');
const csvHandler = require('./csvHandler');
// DB Models
const Bom = require("./models/bom");
const ArbMatrix = require('./models/matrix');
const Project = require('./models/project').ProjectModel;
const ExcludeList = require('./models/exclude');
const RPN = require('./models/rpn');
const Planogram = require('./models/planogram');
const MasterBom = require('./models/masterBom');

async function bom(req, res) {
    let form = new IncomingForm(),
        tag, suffix;

    form.parse(req);

    form.on('field', (name, field) => {
        if (name === 'tag') return tag = field;
        if (name === 'suffix') return suffix = field; 
    });
    form.on('error', (err) => {
        console.error(err);
        res.sendStatus(500);
        throw err;
    });

    form.on('file', async (name, file) => {
        const reader = new FileReader();

        // Parse & Save to Disk
        reader.readAsArrayBuffer(file);

        const readFile = new Promise((res, rej) => {
            reader.onload = async (evt) => {
                const view = new Uint8Array(reader.result);
    
                // retrieve data as {json: obj, csv: string, date: string, uploadDate: Date}
                let newDatum = parser.xlsParser(reader.result, tag, suffix);
                newDatum.name = file.name;
    
                // send csv to csvHandler and wait for resolution
                // return the new data-object
                // send the json back to the client as response
                res(await addJson(newDatum));
            };
        });

        if (await saveBomAndUpdateProject(await readFile)) {
            res.json();
        } else {
            res.sendStatus(500);
        }
    });
}

async function addJson (datum) {
    // wait for the d3.dsv-handler to filter and convert the csv-string
    let promise = new Promise ((res, rej) => {
        res(csvHandler.csvToJson(datum.csv, datum.project));
    });
    datum.json = await promise;
    delete datum.csv;

    return datum;
}

function consumption (req, res) {
    const id = req.params.id;
    const reader = new FileReader();
    let form = new IncomingForm();

    form.on('file', (field, file) => {
        // Parse & save to disk
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);
            const consumption = parser.consumptionParser(reader.result);

            RPN.findOne({id: id}, (err, rpn) => {
                if (err) {
                    res.send(503);
                    return console.error(err);
                }
                const parts = JSON.parse(JSON.stringify(rpn.parts));

                parts.forEach((part, i) => {
                    const match = consumption.find(_part => _part.id === part.id);

                    if (match) {
                        part.usage = parseFloat(match.usage);
                        part.diff = parseFloat(match.usage) - part.monthlyCount;
                    }
                    else {
                        part.diff = i > 2 ? "No Refill" : "";
                    }
                });
                rpn.parts = parts;
                rpn.hasConsumption = true;
                rpn.save(() => {
                    res.status(201).json();
                });
            });
        });
    });

    form.parse(req);
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

            // fs.writeFile(path.join(uploadDir, '/arb-matrix/', file.name), view);
            // fs.writeFile(path.join(uploadDir, '/arb-matrix/', 'arbMatrix.json'), JSON.stringify(newMatrix));

            ArbMatrix.find((err, data) => {
                if (err) {
                    res.status(500).send(err);
                    return console.error(err);
                }

                if (data.length > 0) {
                    ArbMatrix.findOneAndUpdate({}, matrixObj, {}, (err) => {
                        if (err) {
                            res.status(500).send(err);
                            return console.error(err);
                        }
                        res.status(203).send([file.name]);
                    });
                } else {
                    const dbModel = new ArbMatrix(matrixObj);
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

function excludeList(req, res) {
    const reader = new FileReader();
    let form = new IncomingForm();

    form.on('file', (field, file) => {
        // Parse & save to disk
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', (evt) => {
            const view = new Uint8Array(reader.result);
            const excludeList = parser.excludeListParser(reader.result);

            // fs.writeFile(path.join(uploadDir, '/arb-matrix/', file.name), view);
            // fs.writeFile(path.join(uploadDir, '/arb-matrix/', 'excludeList.json'), JSON.stringify(excludeList));

            ExcludeList.find((err, data) => {
                if (err) {
                    res.status(500).send(err);
                    return console.error(err);
                }

                if (data.length > 0) {
                    ExcludeList.findOneAndUpdate({}, {exclude: excludeList}, {}, (err) => {
                        if (err) {
                            res.status(500).send(err);
                            return console.error(err);
                        }
                        res.status(203).send([file.name]);
                    });
                } else {
                    const dbModel = new ExcludeList({exclude: excludeList});
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

function planogram (req, res) {
    const id = req.params.id;
    const reader = new FileReader();
    let form = new IncomingForm();

    form.on('file', (field, file) => {
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', async (evt) => {
            const view = new Uint8Array(reader.result);
            const planogram = await parser.planogramParser(reader.result, id);

            Planogram.findOneAndUpdate({id: id}, {
                mapping: planogram.mapping,
                POG: planogram.POG,
                updated: new Date(),
            }, {
                upsert: true,
                new: true,
            }, (err, data) => {
                if (err) {
                    res.sendStatus(500);
                    console.error(err);
                }
                else {
                    MasterBom.findOneAndUpdate({id: id}, {planogram: true});
        
                    res.json();
                    console.log(`Planogram ${id} created`);
                }
            });
        });
    });

    form.parse(req);
}

async function saveBomAndUpdateProject(bom) {
    const dbModel = new Bom(await updateListId(bom));

    const success = new Promise((res) => {
        dbModel.save((err) => {
            if (err) {
                console.error(err);
                res(false);
            }
    
            Project.findOne({tag: bom.project}, (err, project) => {
                if (err) throw err;
                if (project) {
                    project.boms.push(bom.id);
                    project.boms.sort().reverse();
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
        Bom.find({id: { $regex: `.*${list.id}.*`}}, (err, data) => {
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

module.exports = {bom, matrix, excludeList, consumption, planogram};