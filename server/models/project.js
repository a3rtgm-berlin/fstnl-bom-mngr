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
    bomLists: [String],
    active: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'project-data'
});

const ProjectModel = mongoose.model('Project', projectSchema);

module.exports = { ProjectModel, projectSchema };