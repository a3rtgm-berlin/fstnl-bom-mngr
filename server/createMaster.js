const Bom = require("./models/bom");
const MasterBom = require('./models/masterBom');
const MovingFile = require('./movingFile');
const ArbMatrix = require('./models/matrix');
const Planogram = require('./models/planogram');


const createMasterBom = function (req, res) {
    const id = req.params.id;

    Bom.find({id: { $regex: id, $options: 'i' }}, async (err, boms) => {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        const newMaster = await combineLists(
            boms.map((bom) => bom.json.map((mat) => {
                mat.Boms = [bom.id];
                return mat;
            })),
            id,
            boms[0].date,
            boms.map(list => list.project));
        const dbModel = new MasterBom(newMaster);

        MasterBom.findOne({id: {$lt: id}}).sort({id: -1}).exec(async (err, lastMaster) => {
            if (err) {
                res.sendStatus(404);
                return console.error(err);
            }

            if (lastMaster) {
                // if (lastMaster.planogram) {
                //     const mapping = await Planogram.find({id: lastMaster.id}).exec();
                //     lastMaster.json = mapping || lastMaster.json;
                // }
                if (lastMaster.id < id) {
                    let compare = new Promise((res, rej) => {
                        res(new MovingFile([dbModel, lastMaster]));
                    });
                    const movingFile = await compare;
                    dbModel.movingFile = movingFile;
                }
            }

            dbModel.save((err) => {
                if (err) {
                    res.sendStatus(500);
                    return console.error(err);
                }

                res.status(201).send([id]);
            });
        });
    });
};

async function combineLists(boms, id, date, projectTags) {
    var masterList = new Set([].concat(...boms));

    masterList.forEach((mat1, e1, i) => {
        masterList.forEach((mat2, e2, j) => {
            if (mat1.Location === mat2.Location && mat1.Part === mat2.Part && mat1.Boms[0] !== mat2.Boms[0]) {
                mat1['Quantity Total'] += mat2['Quantity Total'];
                mat1.Boms.push(mat2.Boms[0]);
                masterList.delete(mat2);
            }
        });
    });

    masterList = await calculateCarts(masterList);

    return {
        id: id,
        projects: projectTags,
        json: Array.from(masterList),
        movingFile: {},
        date: date,
        uploadDate: new Date(),
        rpn: false,
        planogram: false
    };
}

async function calculateCarts(list) {
    var locations, arbMatrix;

    // let promiseMatrix = new Promise((res, rej) => {
    //     ArbMatrix.findOne({}, (err, data) => {
    //         if (err) return console.error(err);
    
    //         res(data);
    //     });
    // });

    // arbMatrix = await promiseMatrix;
    arbMatrix = await ArbMatrix.findOne({}).exec();
    locations = Array.from(list).reduce((res, item) => {
        const location = res.find(el => el.Location === item.Location);

        if (location) {
            location.parts += 1;
            return res;
        } else {
            const newStation = {
                Location: item.Location,
                parts: 1,
                wagons: 1,
                bins: 2
            }
            return [...res, newStation];
        }
    }, [])
    locations.forEach(station => {
        const stationFromMatrix = arbMatrix.json.find(stat => stat.Location === station.Location);
        const wagonSize = stationFromMatrix ? stationFromMatrix.WagonSize : 60;

        station.wagons = Math.ceil(station.parts / wagonSize);
        station.bins = station.parts * 2;
    });

    list.forEach((mat1, e1, i) => {
        mat1.StationParts = null;
        mat1.StationWagons = null;
        mat1.StationBins = null;

        if (mat1.location !== "No Location") {
            const location = locations.find(station => station.Location === mat1.Location);

            if (location) {
                mat1.StationParts = location.parts;
                mat1.StationWagons = location.wagons;
                mat1.StationBins = location.bins;
            }
        }
    });
    
    return list;
}

module.exports = createMasterBom;