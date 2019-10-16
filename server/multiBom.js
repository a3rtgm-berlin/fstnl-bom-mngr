const MaterialList = require('./models/list').MaterialListModel;
const mongoose = require('../node_modules/mongoose');

module.exports = class MultiBom {
    constructor(boms) {
        this.list = boms[0];
        this.list.id = boms[0].id.substring(0, boms[0].id.indexOf('-') + 8) + '-M';

        for (let i = 1; i < boms.length; i++) {
            this.mergeIntoMultiBom(boms[i]);
        }
    }

    mergeIntoMultiBom(bom) {
        this.list.json.forEach((part) => {
            bom.json.forEach(_part => {
                if (_part.Station === part.Station && _part.Material === part.Material) {
                    part.Menge = part.Menge >= _part.Menge ? part.Menge : _part.Menge;
                    _part.delete = true;
                }
            });
        });
        const newItems = bom.json.filter(part => !part.delete);
        this.list.json = [...this.list.json, ...newItems];

        bom.remove();
    }
}