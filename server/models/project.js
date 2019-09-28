const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    trainsCount: Number,
    deadline: Date,
    bomLists: [String]
}, {
    collection: 'project-data'
});

const ProjectModel = mongoose.model('Project', projectSchema);

module.exports = { ProjectModel, projectSchema };