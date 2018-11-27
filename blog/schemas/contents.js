const mongoose = require("mongoose");
module.exports = new mongoose.Schema({
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  title:String,
  description: {
    type: String,
    default: ""
  },
  content:{
    type: String,
    default: ""
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  addTime:{
    type: Date,
    default: new Date()
  },
  views:{
    type: Number,
    default: 0
  },
  comments:{
    type: Array,
    default:[]
  }
})