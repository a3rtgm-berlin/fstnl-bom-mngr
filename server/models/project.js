const mongoose = require("../../node_modules/mongoose");
const MaterialList = require("./list").materialListSchema;
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    trainsCount: Number,
    deadline: Date,
    bomLists: [MaterialList]
}, {
    collection: 'project-data'
});

module.exports = {ProjectModel: mongoose.model('Project', projectSchema), projectSchema };