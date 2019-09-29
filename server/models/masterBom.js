const mongoose = require('../../node_modules/mongoose');
const materialListSchema = require('./list').materialListSchema;
const MasterBom = mongoose.model('MasterBom', materialListSchema);

module.exports = MasterBom;