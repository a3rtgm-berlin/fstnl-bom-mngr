const mongoose = require('../../node_modules/mongoose');
const Schema = mongoose.Schema;

const masterBomSchema = new Schema({
    id: String,
    json: {
        type: Object,
        required: true,
        default: {}
    },
    comparison: Object,
    date: String,
    uploadDate: Date,
    projects: [String],
    rpn: Boolean,
    planogram: Boolean
}, {
    collection: 'master-bom'
});


module.exports = mongoose.model('MasterBom', masterBomSchema);