const crypto = require('crypto');

module.exports.jwtSecret = 'Ij80d1EKBFfX6SZuZpUl81uomYnztg50q2QtTk1kO77KNV3DaNM8C6nPVyccC62S';

module.exports.encrypt = function encrypt(text) {
    const cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeq');
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

module.exports.decrypt = function decrypt(text) {
    const decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeq');
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};