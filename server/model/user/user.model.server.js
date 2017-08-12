module.exports=function (model) {
    var q = require('q');
    var mongoose = require('mongoose');
    var userSchema = require('./user.schema.server')();
    var userModel = mongoose.model('mozzieUser', userSchema);
    var api={
        createUser: createUser,
        deleteUser: deleteUser,
        updateProfile: updateProfile
    };
    return api;
    function createUser(user) {
        var deferred = q.defer();
        userModel
            .create(user, function (err, user) {
                if (error) {
                    deferred.reject(error);
                } else{
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        userModel
            .remove({_id: userId}, function (error, status) {
                if(error){
                    deferred.abort(error);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function updateProfile(user) {
        return userModel.update({_id: user._id},
            {$set:
                {name:user.name,
                photo: user.photo,
                email: user.email}});
    }
};