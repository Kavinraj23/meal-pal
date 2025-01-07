require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.createSecretToken = (id) => { // creating a JWT
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: 7 * 24 * 60 * 60,
    })
}