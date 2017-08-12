(function () {
    angular
        .module("mozzie")
        .factory("UserService", UserService);

    function UserService($http) {
        var activeUser = {};

        var api = {
            "login": login,
            "logout": logout,
            "register": register,
            "deleteUser": deleteUser,
            "loggedin": loggedin,
            "isAdmin": isAdmin,
            "updateActiveUser": updateActiveUser,
            "activeUser": activeUser
        };
        return api;

        function login(user) {
            return $http.post('/api/login', user)
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

        function register(user) {
            return $http.post("/api/register", user);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }

        function loggedin() {
            return $http.post('/api/loggedin')
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

        function updateActiveUser(actUser) {
            if(actUser._id){
                activeUser.username = actUser.username;
                activeUser.firstName = actUser.firstName;
                activeUser.role = actUser.role;
                activeUser._id = actUser._id;
            }
        }
    }
});