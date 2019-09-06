const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const materialListSchema = new Schema({
    id: String,
    json: {
        type: Object,
        required: true,
        default: {}
    },
    csv: String,
    date: String,
    uploadDate: Date
}, {
    collection: 'order-data'
});

module.exports = mongoose.model('MaterialList', materialListSchema);