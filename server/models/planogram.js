const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const planogramSchema = new Schema({
    id: String,
    POG: [Object],
    mapping: [Object],
    updated: Date,
}, {
    collection: 'planogram'
});

module.exports = mongoose.model('Planogram', planogramSchema);