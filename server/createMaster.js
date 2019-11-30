const MaterialList = require("./models/list").MaterialListModel;
const MasterBom = require('./models/masterBom');
const Comparison = require('./compareLists');
const ArbMatrix = require('./models/arbMatrix');


const createMasterBom = function (req, res) {
    const id = req.params.id;

    MaterialList.find({id: { $regex: id, $options: 'i' }}, async (err, lists) => {
        if (err) {
            res.sendStatus(500);
            return console.error(err);
        }

        const newMaster = await combineLists(
            lists.map((list) => list.json.map((mat) => {
                mat.lists = [list.id];
                return mat;
            })),
            id,
            lists[0].date,
            lists.map(list => list.project));
        const dbModel = new MasterBom(newMaster);

        MasterBom.findOne({id: {$lt: id}}).sort({id: -1}).exec(async (err, lastMaster) => {
            if (err) {
                res.sendStatus(404);
                return console.error(err);
            }

            if (lastMaster && lastMaster.id < id) {
                let compare = new Promise((res, rej) => {
                    res(new Comparison([dbModel, lastMaster]));
                });
                const comparison = await compare;
                dbModel.comparison = comparison;
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

async function combineLists(lists, id, date, projectTags) {
    var masterList = new Set([].concat(...lists));

    masterList.forEach((mat1, e1, i) => {
        masterList.forEach((mat2, e2, j) => {
            if (mat1.Station === mat2.Station && mat1.Material === mat2.Material && mat1.lists[0] !== mat2.lists[0]) {
                mat1.Menge += mat2.Menge;
                mat1.lists.push(mat2.lists[0]);
                masterList.delete(mat2);
            }
        });
    });

    masterList = await calculateCarts(masterList);

    return {
        id: id,
        projects: projectTags,
        json: Array.from(masterList),
        comparison: {},
        date: date,
        uploadDate: new Date()
    };
}

async function calculateCarts(list) {
    var stations, arbMatrix;

    let promiseMatrix = new Promise((res, rej) => {
        ArbMatrix.findOne({}, (err, data) => {
            if (err) return console.error(err);
    
            res(data);
        });
    });

    arbMatrix = await promiseMatrix;
    stations = Array.from(list).reduce((res, item) => {
        const station = res.find(el => el.Station === item.Station);

        if (station) {
            station.parts += 1;
            return res;
        } else {
            const newStation = {
                Station: item.Station,
                parts: 1,
                carts: 1,
                bins: 2
            }
            return [...res, newStation];
        }
    }, [])
    stations.forEach(station => {
        const stationFromMatrix = arbMatrix.json.find(stat => stat.Area === station.station);
        const cartSize = stationFromMatrix ? stationFromMatrix.CartSize : 60;

        station.carts = Math.ceil(station.parts / cartSize);
        station.bins = station.parts * 2;
    });

    list.forEach((mat1, e1, i) => {
        mat1.stationParts = null;
        mat1.stationCarts = null;
        mat1.stationBins = null;

        if (mat1.station !== "No Location") {
            const station = stations.find(station => station.Station === mat1.Station);

            if (station) {
                mat1.stationParts = station.parts;
                mat1.stationCarts = station.carts;
                mat1.stationBins = station.bins;
            }
        }
    });
    
    return list;
}

module.exports = createMasterBom;