const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const materialListSchema = new Schema({
    id: String,
    name: String,
    project: String,
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

module.exports = { MaterialListModel: mongoose.model('MaterialList', materialListSchema), materialListSchema };