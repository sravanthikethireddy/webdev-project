module
    .exports = function (app, model) {
    var userModel = model.userModel;
    var bcrypt = require("bcrypt-nodejs");
    var songModel = model.songModel;
    var passport = require('passport');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/checkLoggedIn', checkLoggedIn);
    app.post("/api/register", register);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.get("/api/user/all", findAllUsers);
    // app.get("/api/user/all", findAllUsers);
    app.get("/api/artist", findAllArtists);
    // app.get("/api/artist", findAllArtists);
    app.put("/api/user/:userId", updateUser);
    // app.put("/api/user/:userId", updateUser);
    app.post('/api/user/search', searchUsers);
    // app.post('/api/user/search', searchUsers);
    app.put("/api/profile/:userId", updateProfile);
    // app.put("/api/profile/:userId", updateProfile);
    app.get('/api/user/favorite', getFavorites);
    // app.get('/api/user/favorite', getFavorites);
    app.post('/api/user/addsong/:songId', addSong);
    app.delete("/api/user/:userId", deleteUser);
    // app.delete("/api/user/:userId", deleteUser);
    app.post('/api/user/deletesong/:songId', deleteSong);
    app.post('/api/logout', logout);
    app.post('/api/user/:userId/addMessage', addMessage);
    app.post('/api/user/:userId/deleteMessage', deleteMessage);
    app.get('/api/user/message', getMessages);
    app.post('/api/isAdmin', isAdmin);
    app.post('/api/isArtist', isArtist);
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/google/callback',
        passport.authenticate('google', {
            responseRedirect: '/#!/home',
            failureRedirect: '/#!/login'
        }));
    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                if (user) {
                    done(null, user);
                } else {
                    var user = {
                        username: profile.emails[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.pictures[0].value,
                        google: {
                            id: profile.id
                        }
                    };
                    return userModel.createUser(user);
                }
            }, function (error) {
                done(error, null);
            })
            .then(function (user) {
                done(null, user);
            }, function (error) {
                done(error, null);
            });
    }


    // function localStrategy(username, password, done) {
    //     userModel
    //         .findUserByCredentials(username, password)
    //         .then(
    //             function(user) {
    //                 if (!user) {
    //                     return done(null, false);
    //                 }
    //                 return done(null, user);
    //             },
    //             function(err) {
    //                 if (err) { return done(err); }
    //             }
    //         );
    // }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (!user) {
                        return done(null, false);
                    }
                    if (bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (error) {
                    if (error) {
                        return done(error);
                    }
                }
            );
    }

    function updateProfile(req, res) {
        if (req.user && req.user._id === req.body._id) {
            userModel
                .updateProfile(req.body)
                .then(function (status) {
                    res.send(200);
                });
        } else {
            res.json({});
        }
    }


    function searchUsers(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .searchUsers(req.query.key)
                .then(function (users) {
                    if (users)
                        res.json(users);
                    else
                        res.sendStatus(500);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }


    function findUser(req, res) {
        var username = req.query.username;
        var mozzieId = req.query.mozzieId;
        if (mozzieId) {
            findUserByMozzieId(req, res);
        } else if (username) {
            findUserByUsername(req, res);
        }
    }


    function login(req, res) {
        var user = req.user;
        res.json(user);
    }


    function checkLoggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }


    // function register(req, res) {
    //     var user = req.body;
    //     userModel
    //         .createUser(user)
    //         .then(function (user) {
    //             req.login(user, function (status) {
    //                 res.json(user);
    //             });
    //         });
    // }


    function register(req, res) {
        req.body.password = bcrypt.hashSync(req.body.password);
        userModel
            .createUser(req.body)
            .then(function (user) {
                if (user) {
                    req.login(user, function (status) {
                        res.json(user);
                    });
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }


    function findUserById(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }


    function findUserByUsername(req, res) {
        userModel
            .findUserByUsername(req.query.username)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }


    function findUserByMozzieId(req, res) {
        userModel
            .findUserByMozzieId(req.query.mozzieId)
            .then(function (user) {
                if (user)
                    res.json(user);
                else
                    res.sendStatus(500);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }


    // function findUserByCredentials(req, res) {
    //     var username = req.query.username;
    //     var password = req.query.password;
    //     userModel
    //         .findUserByCredentials(username, password)
    //         .then(function (user) {
    //             res.json(user);
    //         }, function (error) {
    //             res.sendStatus(500).send(error);
    //         });
    // }


    function findAllUsers(req, res) {
        if (req.user && req.user.role === 'ADMIN') {
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.json(users);
                });
        } else {
            res.json({});
        }
    }


    function findAllArtists(req, res) {
        userModel
            .findAllArtists()
            .then(function (artists) {
                res.json(artists);
            }, function (error) {
                res.sendStatus(404);
            });
    }


    // function updateUser(req, res) {
    //     var user = req.body;
    //     var userId = req.params.userId;
    //
    //     userModel
    //         .updateUser(userId, user)
    //         .then(function (status) {
    //             res.sendStatus(200);
    //         });
    //
    //     // for(var u in users) {
    //     //     if(userId === users[u]._id) {
    //     //         users[u] = user;
    //     //         res.sendStatus(200);
    //     //         return;
    //     //     }
    //     // }
    //     // res.sendStatus(404);
    // }

    function updateUser(req, res) {
        if (req.user && req.user.role === 'ADMIN') {
            userModel
                .updateProfile(req.body)
                .then(function (status) {
                    res.send(status);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function addSong(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .addSong(req.user._id, req.params.songId)
                .then(function (response) {
                    songModel
                        .addFavSong(req.user._id, req.params.songId)
                        .then(function (response) {
                            res.sendStatus(200);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        })
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function deleteUser(req, res) {
        if (req.user && req.user.role === 'ADMIN') {
            userModel
                .deleteUser(req.params.userId)
                .then(function (status) {
                    res.sendStatus(200);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function deleteSong(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .deleteSong(req.user._id, req.params.songId)
                .then(function (response) {
                    songModel
                        .deleteLover(req.user._id, req.params.songId)
                        .then(function (response) {
                            res.sendStatus(200);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        })
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function addMessage(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .addMessage(req.params.userId, req.body)
                .then(function (response) {
                    res.sendStatus(200);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function deleteMessage(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .deleteMessage(req.params.userId, req.body)
                .then(function (response) {
                    res.sendStatus(200);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function getMessages(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .getMessages(req.user._id)
                .then(function (messages) {
                    res.json(messages);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


    function isAdmin(req, res) {
        if (req.isAuthenticated() && req.user.role === 'ADMIN') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function isArtist(req, res) {
        if (req.isAuthenticated() && req.user.role === 'ARTIST') {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }


    function getFavorites(req, res) {
        if (req.isAuthenticated()) {
            userModel
                .getFavorites(req.user._id)
                .then(function (favorites) {
                    res.json(favorites);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(401);
        }
    }


};