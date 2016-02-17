'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MessageSchema = new mongoose.Schema({
  date: {
      type:Date,
      default:Date.now
  },
  name:String,
  text:String,
  scribble:{type:Boolean,default:false},
  origin:mongoose.Schema.Types.ObjectId
});

var RoomSchema = new mongoose.Schema({
  messages: [MessageSchema],
  name:String,
  admin:mongoose.Schema.Types.ObjectId,
  members: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  kind:String,
  img:String
});

export default mongoose.model('Room', RoomSchema);
