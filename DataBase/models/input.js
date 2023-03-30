const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InputSchema = new Schema({
    Domain: String,
    StartTime: String
});
module.exports = mongoose.model('Client_Inputs', InputSchema);