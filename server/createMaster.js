const MaterialList = require('./models/material').MaterialList;
const MasterBom = require('./models/masterBom');

const createMasterBom = function (req, res) {
    const id = req.params.id;

    MaterialList.find({id: { $regex: id }}, (err, data) => {
        if (err) {
            res.sendStatus(500);
            throw err;
        }

        combineLists(data);
    });
};

function combineLists(lists) {
    console.log(lists);
}

module.exports = createMasterBom;