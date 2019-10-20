const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const excludeListSchema = new Schema({
    exclude: [String]
}, {
    collection: 'exclude-data'
});

module.exports = mongoose.model('ExcludeList', excludeListSchema);