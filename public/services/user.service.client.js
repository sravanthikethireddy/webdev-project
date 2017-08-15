(function () {
    angular
        .module("mozzie")
        .factory("UserService", UserService);

    function UserService($http) {
        var activeUser = {messages: []};
        var messageCount = {};
        var activeMenu = {};
        var api = {
            "login": login,
            "checkLoggedIn": checkLoggedIn,
            "activeUser": activeUser,
            "register": register,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByMozzieId": findUserByMozzieId,
            "findUserByCredentials": findUserByCredentials,
            "findAllUsers": findAllUsers,
            "findAllArtists": findAllArtists,
            "updateUser": updateUser,
            "searchUsers": searchUsers,
            "updateProfile": updateProfile,
            "updateActiveUser": updateActiveUser,
            "addSong": addSong,
            "deleteUser": deleteUser,
            "deleteSong": deleteSong,
            "logout": logout,
            "addMessage": addMessage,
            "deleteMessage": deleteMessage,
            "getMessages": getMessages,
            "isAdmin": isAdmin,
            "isArtist": isArtist,
            "activeMenu": activeMenu,
            "messageCount": messageCount,
            "getFavorites": getFavorites
        };
        return api;

        function login(user) {
            return $http.post('/api/login', user)
                .then(function (response) {
                    return response.data;
                });
        }

        function checkLoggedIn() {
            return $http.post('/api/checkLoggedIn')
                .then(function (response) {
                    return response.data;
                });
        }


        function register(user) {
            return $http.post("/api/register", user);
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findUserByMozzieId(MozzieId) {
            return $http.get("/api/user?MozzieId=" + MozzieId)
                .then(function (response) {
                    return response.data;
                }, function (error) {
                })
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function findAllUsers() {
            return $http.get('/api/user/all')
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllArtists() {
            return $http.get('/api/artist');
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/user/" + userId, newUser);
        }

        function searchUsers(searchWord) {
            return $http.post('/api/user/search?key=' + searchWord)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateProfile(user) {
            return $http.put('/api/profile/' + user._id, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateActiveUser(actUser) {
            if (actUser._id) {
                activeUser.username = actUser.username;
                activeUser.firstName = actUser.firstName;
                activeUser.picture = actUser.picture;
                activeUser._id = actUser._id;
                activeUser.messages = actUser.messages;
                activeUser.role = actUser.role;
                messageCount.value = activeUser.messages.filter(function (value) {
                    return !value.read;
                }).length;
            } else {
                activeUser.username = null;
                activeUser.firstName = null;
                activeUser.picture = null;
                activeUser._id = null;
                activeUser.messages = null;
                activeUser.role = null;
                messageCount.value = null;
            }
        }

        function addSong(songId) {
            return $http.post('/api/user/addsong/' + songId)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function deleteSong(songId) {
            return $http.post('/api/user/deletesong/' + songId)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            return $http.post('/api/logout')
                .then(function (response) {
                    return response.data;
                });
        }

        function addMessage(userId, message) {
            return $http.post('/api/user/' + userId + '/addMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteMessage(userId, message) {
            return $http.post('/api/user/' + userId + '/deleteMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function getMessages() {
            return $http.get('/api/user/message')
                .then(function (response) {
                    return response.data;
                });
        }

        function isAdmin() {
            return $http.post('/api/isAdmin')
                .then(function (response) {
                    return response.data;
                });
        }

        function isArtist() {
            return $http.post('/api/isArtist')
                .then(function (response) {
                    return response.data;
                });
        }

        function getFavorites() {
            return $http.get('/api/user/favorite')
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();