const MaterialList = require('./models/list').MaterialListModel;

module.exports = class MultiBom {
    constructor(boms) {
        this.list = boms[0];

        for (let i = 1; i < boms.length; i++) {
            this.mergeIntoMultiBom(boms[i]);
        }
    }

    mergeIntoMultiBom(bom) {
        console.log(bom);
    }
}