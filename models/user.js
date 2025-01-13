const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true, // Tambahkan ini
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)