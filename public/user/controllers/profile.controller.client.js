(function () {
    angular
        .module("mozzie")
        .controller("ProfileController", ProfileController);

    function ProfileController($location, activeUser, UserService) {
        var model = this;
        model.logout = logout;
        model.uploadPicture = uploadPicture;
        model.updateProfile = updateProfile;
        model.getPicture = getPicture;
        model.deleteUser = deleteUser;

        function init() {
            model.activeUser = activeUser;
            model.user = activeUser;
        }

        init();

        function logout() {
            UserService
                .logout()
                .then(function () {
                    UserService.updateActiveUser({});
                    $location.url('/login');
                });
        }

        function uploadPicture() {
        }

        function updateProfile(user) {
            UserService
                .updateProfile(user)
                .then(function () {
                    model.message = "OK!"
                }, function (err) {
                    model.error = "Not Ok!";
                });

        }

        function getPicture() {
            if (model.user) {
                return model.user.picture;
            } else {

            }
        }


        function deleteUser() {
            var promise = UserService.deleteUser(userId);
            promise.success(function (success) {
                $location.url("/login");
            })
                .error(function (error) {
                    model.error = "Nope!";
                })
        }
    }
})();