const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    date: { type: String },
    isDisabled: { type: Boolean, default: false }

    // Here is role too
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(require('mongoose-role'), {
    roles: ['user', 'admin'],
    accessLevels: {
        user: ['user', 'admin'],
        admin: ['admin']
    }
})

module.exports = mongoose.model("User", userSchema);
