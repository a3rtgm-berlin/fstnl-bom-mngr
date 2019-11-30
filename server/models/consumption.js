const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const consumptionSchema = new Schema({
    email: String,
    username: String,
}, {
    collection: 'consumption-data'
});

const ConsumptionModel = mongoose.model('Consumption', consumptionSchema);

module.exports = ConsumptionModel;