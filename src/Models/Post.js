const mongoose = require("mongoose");

const Post = mongoose.Schema({
  body: String,
  username: String,
  createdAt: String,

  comments: [{ username: String, body: String, createdAt: String }],
  likes:[{username:String,createdAt:String}],
  user:{type:mongoose.Schema.Types.ObjectId,ref:'aUser'}
});


module.exports = mongoose.model("post",Post)