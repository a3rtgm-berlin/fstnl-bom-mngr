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

        const newMaster = combineLists(
            lists.map((list) => list.json.map((mat) => {
                mat.list = list.id;
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

function combineLists(lists, id, date, projectTags) {
    const masterList = new Set([].concat(...lists));

    masterList.forEach((mat1, e1, i) => {
        masterList.forEach((mat2, e2, j) => {
            if (mat1.Station === mat2.Station && mat1.Material === mat2.Material && mat1.list !== mat2.list) {
                mat1.Menge += mat2.Menge;
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