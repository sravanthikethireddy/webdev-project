module.exports=function () {
  var mongoose = require('mongoose');
  var userSchema = mongoose.Schema({
      username:{type:String, unique:true},
      password:String,
      role:{type:String, enum:['ADMIN','ARTIST','USER'],default:'USER'},
      dateCreated:{type:Date, default: Date.now}
  },{collection:'mozzie.user'});
  return userSchema;
};