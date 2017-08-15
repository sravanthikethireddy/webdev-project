(function () {
    angular
        .module("mozzie")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var model = this;
        model.login = login;

        function init() {
        }

        init();

        function login(user) {
            if (user === null) {
                model.error = "Can't proceed without username";
                return;
            }
            if (user.password === null) {
                model.error = "Password!!Duh!!";
                return;
            }
            UserService
                .login(user)
                .then(function (user) {
                    if (user) {
                        if (user.role === 'ADMIN')
                            $location.url("/admin");


                        else if (user.role === 'ADMIN')
                            console.log("enter the path");
                        else
                            $location.url("/favorite");
                    } else {
                        model.error = " ";
                    }
                }, function (response) {
                    model.error = " ";
                });
        }
    }
})();