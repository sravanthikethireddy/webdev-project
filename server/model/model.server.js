module.exports = function (app) {
  var userModel = require('./user/user.model.server')();
  var songModel = require('./song/song.model.server')();
  var model = {
      userModel:userModel,
      songModel:songModel
  };
  return model;
};