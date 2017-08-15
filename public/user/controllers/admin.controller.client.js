(function () {
    angular
        .module('mozzie')
        .controller('AdminController', AdminController);

    function AdminController(UserService) {
        var model = this;
        model.updateUser = updateUser;
        model.deleteUser = deleteUser;
        // model.findAllUsers=findAllUsers;

        function init() {
            UserService.activeMenu.active = " ";
            findAllUsers();
        }
        init();

        function updateUser(user) {
            UserService
                .updateUser(user)
                .then(findAllUsers);
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(findAllUsers);
        }

        function findAllUsers() {
            UserService
                .findAllUsers()
                .then(function (users) {
                    model.users = users;
                }, function (err) {
                    model.error = err;
                });
        }
    }
})();