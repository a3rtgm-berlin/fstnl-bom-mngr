const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excludeListSchema = new Schema({
    exclude: [String]
}, {
    collection: 'exclude-data'
});

module.exports = mongoose.model('ExcludeList', excludeListSchema);