const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//will add fields(username, hash, salt, hashed password) to userSchema + other methods
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);