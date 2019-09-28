const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const arbMatrixSchema = new Schema({
    json: {
        type: Object,
        required: true,
        default: {}
    },
    uploadDate: {
        type: Date,
        required: true,
        default: new Date()
    }
}, {
    collection: 'matrix-data'
});

module.exports = mongoose.model('ArbMatrix', arbMatrixSchema);