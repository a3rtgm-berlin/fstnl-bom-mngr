const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const rpnSchema = new Schema({
    id: String,
    hasConsumption: Boolean,
    parts: [Object]
}, {
    collection: 'rpn'
});

const RPNModel = mongoose.model('RPN', rpnSchema);

module.exports = { RPNModel: RPNModel, rpnSchema };