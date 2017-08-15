module
    .exports = function () {
    var q = require('q');
    var mongoose = require('mongoose');
    var userSchema = require('./user.schema.server')();
    var userModel = mongoose.model('MozzieUser', userSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByMozzieId: findUserByMozzieId,
        findUserByCredentials: findUserByCredentials,
        findAllUsers: findAllUsers,
        updateProfile: updateProfile,
        findAllArtists: findAllArtists,
        // updateUser: updateUser,
        searchUsers: searchUsers,
        addSong: addSong,
        deleteUser: deleteUser,
        deleteSong: deleteSong,
        addMessage: addMessage,
        deleteMessage: deleteMessage,
        getMessages: getMessages,
        getFavorites: getFavorites,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;


    function createUser(user) {
        var deferred = q.defer();
        userModel
            .create(user, function (error, response) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    deferred.resolve(response);
                }
            });

        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        userModel
            .findOne({username: username}, function (error, response) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(response);
                }
            });

        return deferred.promise;
    }

    function findUserByMozzieId(mozzieId) {
        var deferred = q.defer();
        userModel
            .findOne({mozzieId: mozzieId}, function (error, user) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        userModel
            .findOne({username: username, password: password},
                function (error, user) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }


    function findAllUsers() {
        return userModel.find();
    }

    function updateProfile(user) {
        return userModel.update({_id: user._id},
            {
                $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    picture: user.picture
                }
            });
    }

    function findAllArtists() {
        var deferred = q.defer();
        userModel
            .find({role: 'ARTIST'}, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    deferred.resolve(response);
                }
            });

        return deferred.promise;
    }


    function updateUser(user) {
        var deferred = q.defer();
        userModel
            .update({_id: user._id}, {$set: user}, function (error, response) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }

    function searchUsers(searchWord) {
        var deferred = q.defer();
        userModel
            .find({
                    role: 'USER',
                    $or: [{username: {"$regex": searchWord, "$options": "i"}},
                        {lastName: {"$regex": searchWord, "$options": "i"}},
                        {firstName: {"$regex": searchWord, "$options": "i"}}]
                },
                function (error, response) {
                    if (error) {
                        deferred.abort(error);
                    } else {
                        deferred.resolve(response);
                    }
                });
        return deferred.promise;
    }


    function addSong(userId, songId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    user.favorites.push(songId);
                    user.save();
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }


    function deleteUser(userId) {
        var deferred = q.defer();
        userModel
            .delete({_id: userId}, function (error, response) {
                if (error) {
                    deferred.abort(error);
                } else {
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }


    function deleteSong(userId, songId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    for (var favorite in response.favorites) {
                        if (response.favorites[favorite] == songId) {
                            response.favorites.splice(t, 1);
                            response.save();
                        }
                    }
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }


    function addMessage(userId, message) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    response.messages.push(message);
                    response.save();
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    }

    function deleteMessage(userId, message) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    for (var msg in response.messages) {
                        if ((response.messages[msg].user === message.user._id) &&
                            (response.messages[msg].song === message.song._id)) {
                            response.messages[msg].read = true;
                            response.save();
                        }
                    }
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }


    function getMessages(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({
                path: 'messages.user messages.song',
                select: 'firstName lastName title mbid'
            })
            .exec(function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    deferred.resolve(response.messages);
                }
            });
        return deferred.promise;
    }


    function getFavorites(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({
                path: 'favorites',
                populate: {path: 'artist', select: 'mozzieId'}
            })
            .exec(function (error, response) {
                if (error)
                    deferred.reject(error);
                else {
                    deferred.resolve(response.favorites);
                }
            });
        return deferred.promise;
    }

    function findUserByGoogleId(googleId) {
        return userModel.findOne({
            'google.id': googleId
        });
    }


};