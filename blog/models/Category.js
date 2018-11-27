const mongoose = require("mongoose");
const categorySchema = require('../schemas/categories');
module.exports = mongoose.model('Category', categorySchema)