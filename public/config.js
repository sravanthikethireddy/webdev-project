(function () {
    angular
        .module("mozzie")
        .config(Configuration);

    function Configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "home/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    actUser: checkUser
                }
            })
            .when("/login", {
                templateUrl: "user/views/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/admin", {
                templateUrl: "user/views/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    admin: checkAdmin
                }
            })
            .when("/register", {
                templateUrl: "user/views/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    activeUser: checkLoggedin
                }
            })
            .when("/logout", {
                resolve: {
                    logout: logout
                }
            })
    }

    function checkUser($q, UserService) {
        var defer = $q.defer();
        UserService
            .loggedin()
            .then(function (user) {
                defer.resolve(user);
            });
        return defer.promise;
    }

    function checkAdmin($q, $location, UserService) {
        var defer = $q.defer();
        UserService
            .isAdmin()
            .then(function (user) {
                if (user !== '0') {
                    UserService
                        .updateActiveUser(user);
                    defer.resolve(user);

                }
                else {
                    defer.reject();
                    $location.url('/user/' + user._id);
                }
            });
        return defer.promise;
    }

    function checkLoggedin($q, $timeout, $http, $location, $rootScope) {
        // var defer = $q.defer();
        // $http.get('/api/loggedin').success(function(user) {
        //     $rootScope.errorMessage = null;
        //     if (user !== '0') {
        //         defer.resolve(user);
        //     } else {
        //         defer.reject();
        //         $location.url('/');
        //     }
        // });
        // return defer.promise;
        var defer = $q.defer();
        UserService
            .loggedin()
            .then(function (user) {
                if (user !== '0') {
                    defer.resolve(user);
                }
                else {
                    defer.reject();
                    $location.url('/login');
                }
                UserService
                    .updateActiveUser(user);
            });
        return defer.promise;
    }

});