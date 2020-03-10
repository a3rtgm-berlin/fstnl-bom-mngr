const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    tag: {
        type: String,
        uppercase: true
    },
    description: String,
    trainsCount: Number,
    deadline: Date,
    boms: [String],
    multiBom: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdBy: String,
    created: Date

}, {
    collection: 'project-data'
});

const ProjectModel = mongoose.model('Project', projectSchema);

module.exports = { ProjectModel, projectSchema };