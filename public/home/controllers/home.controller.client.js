(function () {
    angular
        .module("mozzie")
        .controller("HomeController".HomeController);

    function HomeController($location, UserService, MusicService, actUser) {
        var model = this;
        model.getThumbnail = getThumbnail;
        model.top100 = top100;
        model.viewArtist = viewArtist;
        model.searchWord = "";

        function init() {
            UserService.updateActiveUser(actUser);
            UserService.activeMenu.active = "Home";
            if (MusicService.searchKey)
                MusicService.searchKey = null;
            top100();
        }

        init();

        function getThumbnail(song) {
            return song.image[2]['#text'] ? song.image[2]['#text'] : '../../images/music-song.png';

        }

        function top100() {
            model.songs = [];
            MusicService
                .top100()
                .then(function (response) {
                    data = response.data;
                    data = data.songs.song;
                    model.songs = data;
                })
        }

        function viewArtist(song) {

            MusicService
                .findSongById(song.mbid)
                .then(function (response) {
                    return response.data;
                }, function (error) {
                    return MusicService
                        .findSongBymbidAPI(song.mbid)
                        .then(function (response) {
                            data = response.data;
                            model.song = data.song;
                            return MusicService
                                .getSongInfo(model.song)
                        }, function (error) {
                            model.error = "Can't load the artist, keep singing!";
                        })
                })
                .then(function (song) {
                    model.song._id = song._id;
                    $location.url('/artist/' + song.artist);
                }, function (error) {
                    model.error = "Can't load the artist, keep singing!";
                })
        }
    }
})();