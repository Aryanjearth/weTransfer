const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        required : true,
        type : String,
        maxlen : 10
    }
});

module.exports = mongoose.model('User', UserModel);