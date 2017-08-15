(function () {
    angular
        .module("mozzie")
        .controller("HeaderController", HeaderController);

    function HeaderController($route, $location, UserService, MusicService) {
        var model = this;
        model.activeUser = UserService.activeUser;
        model.activeMenu = UserService.activeMenu;
        model.messageCount = UserService.messageCount;
        model.searchSongs = searchSongs;
        model.updateUser = updateUser;
        model.guestMenu = [
            {
                title: "Home",
                url: "#!/home",
                active: model.activeMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#!/artist",
                active: model.activeMenu.active === "Artists"
            }];
        model.adminMenu = [
            {
                title: "Home",
                url: "#!/home",
                active: model.activeMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#!/artist",
                show: true,
                active: model.activeMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#!/favorite",
                active: model.activeMenu.active === "Favorites"
            },
            {
                title: "Control",
                url: "#!/admin",
                active: model.activeMenu.active === "Control"
            }
        ];
        model.userMenu = [
            {
                title: "Home",
                url: "#!/home",
                show: true,
                active: model.activeMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#!/artist",
                show: true,
                active: model.activeMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#!/favorite",
                show: true,
                active: model.activeMenu.active === "Favorites"
            }
        ];
        model.artistMenu = [
            {
                title: "Home",
                url: "#!/home",
                active: model.activeMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#!/artist",
                active: model.activeMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#!/favorite",
                active: model.activeMenu.active === "Favorites"
            },
            {
                title: "Playlist",
                url: "#!/playlist",
                active: model.activeMenu.active === "playlist"
            }
        ];

        model.menu = model.activeUser._id ? model.userMenu : model.guestMenu;

        function init() {
        }

        init();

        function searchSongs() {
            console.log(model.searchWord);
            MusicService.searchKey = model.searchWord;
            if ($location.path() === '/song') {
                $route.reload();
            } else
                $location.url('/song');
        }

        function updateUser() {
            console.log(model.activeUser);
        }
    }
})();
