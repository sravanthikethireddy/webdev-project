// console.log("Hello")
module.exports = function(app) {
    var model = require("./model/model.server")(app);
    require("./services/user.service.server")(app,model);
    require("./services/music.service.server")(app,model);
    require("./services/upload.service.server")(app,model);
    // require("./services/widget.service.server")(app,model);
};
