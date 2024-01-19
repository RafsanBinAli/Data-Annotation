const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String
    },
    email: {
        type: String,
        required: true,
       
    },
    password: {
        type: String,
        required: true
    },
    // Add other fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
