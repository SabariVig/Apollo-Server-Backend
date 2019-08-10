const mongoose = require('mongoose')

const User = mongoose.Schema(
  {
    username:String,
    email:String,
    password:String,
    createdAt:String
  }
)


module.exports = mongoose.model("user",User)