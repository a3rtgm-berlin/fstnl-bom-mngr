const mongoose = require("../../node_modules/mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    role: Number,
    //admin: Boolean,
    //dev: {type: Boolean, default: false},
}, {
    collection: 'fe-users'
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel, userSchema };