const mongoose = require("mongoose");
const contentSchema = require('../schemas/contents');
module.exports = mongoose.model('Content', contentSchema)