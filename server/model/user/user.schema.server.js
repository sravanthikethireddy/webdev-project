module
    .exports = function () {
    var mongoose = require('mongoose');
    var userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        username: {type: String, unique: true},
        unique: String,
        password: String,
        mozzieId: {type: String, unique: true, sparse: true},
        external: Boolean,
        // description: String,

        picture: String,
        facebook: {
            id: String
        },
        google: {
            id: String
        },
        role: {type: String, enum: ['ADMIN', 'ARTIST', 'USER'], default: 'USER'},
        messages: [{
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieUser'},
            song: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieSong'},
            read: {type: Boolean, default: false}, dateCreated: {type: Date, default: Date.now}
        }],
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'MozzieSong'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'Mozzie.user'});

    return userSchema;
};