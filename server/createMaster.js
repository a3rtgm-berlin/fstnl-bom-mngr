const MaterialList = require("./models/list").MaterialListModel;
const MasterBom = require('./models/masterBom');
const Comparison = require('./compareLists');


const createMasterBom = function (req, res) {
    const id = req.params.id;

    MaterialList.find({id: { $regex: id, $options: 'i' }}, (err, lists) => {
        if (err) {
            res.sendStatus(500);
            throw err;
        }

        console.log(lists.map(list => list.id));
        const newMaster = combineLists(
            lists.map((list) => list.json.map((mat) => {
                mat.lists = [list.id];
                return mat;
            })),
            id,
            lists[0].date,
            lists.map(list => list.project));
        const dbModel = new MasterBom(newMaster);

        MasterBom.findOne({id: {$lt: id}}).sort('id').exec(async (err, lastMaster) => {
            if (err) throw err;

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
                    throw err;
                }

                res.status(201).send([id]);
            });
        });
    });
};

// function combineLists(lists, id, date, projectTags) {
//     let masterList = lists[0];

//     for (let i = 1; i < lists.length; i++) {
//         masterList = addList(masterList, lists[i]);
//     }

//     return {
//         id: id,
//         projects: projectTags,
//         json: Array.from(masterList),
//         comparison: {},
//         date: date,
//         uploadDate: new Date()
//     };
// }

// function addList (masterList, newList) {
//     masterList.forEach((part) => {
//         newList.forEach(_part => {
//             if (_part.Station === part.Station && _part.Material === part.Material) {
//                 part.Menge += _part.Menge;
//                 _part.delete = true;
//             }
//         });
//     });
//     const newItems = newList.filter(part => !part.delete);
//     return [...masterList, ...newItems];
// }

function combineLists(lists, id, date, projectTags) {
    const masterList = new Set([].concat(...lists));

    masterList.forEach((mat1, e1, i) => {
        masterList.forEach((mat2, e2, j) => {
            if (mat1.Station === mat2.Station && mat1.Material === mat2.Material && mat1.lists[0] !== mat2.lists[0]) {
                mat1.Menge += mat2.Menge;
                mat1.lists.push(mat2.lists[0]);
                masterList.delete(mat2);
            }
        });
    });

    return {
        id: id,
        projects: projectTags,
        json: Array.from(masterList),
        comparison: {},
        date: date,
        uploadDate: new Date()
    };
}

module.exports = createMasterBom;