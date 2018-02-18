const mongoose = require('mongoose');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

require('dotenv').config();

userSchema.methods.generateHash = function(password){
    return bcrypt.hashAsync(password, 10).then(hash => {
        this.password = hash;
        return this;
    });
};

userSchema.methods.comparePassword = function(password){

    return bcrypt.compareAsync(password, this.password).then(res => {

        if (!res) return false;
        return this;
    });
};

userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id}, process.env.SECRET || 'change this');
}


module.exports = mongoose.model('User', userSchema);