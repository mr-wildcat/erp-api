const nJwt = require('njwt');
const dateHelper = require('./date');
const cryptoHelper = require('./crypto');

module.exports.createAccessToken = async (user) => {
    const { id, email } = user;
    const credentials = { id, email };

    return new Promise((resolve) => {
        let token = nJwt.create(
            credentials,
            cryptoHelper.jwtSecret,
        );
        token.setExpiration(dateHelper.getExpiredTokenDate());
        token = cryptoHelper.encrypt(String(token));
        resolve(token);
    });
};

module.exports.decodeAccessToken = async (token) => {
    return new Promise((resolve, reject) => {
        nJwt.verify(cryptoHelper.decrypt(String(token)), cryptoHelper.jwtSecret, (err, verifiedJwt) => {
            if (err) {
                reject({
                    status: 409,
                    message: 'Bad token',
                    error: err,
                });
            } else {
                resolve(verifiedJwt);
            }
        });
    });
};

module.exports.createRefreshToken = async (user) => {
    const { id, email } = user;
    const credentials = { id, email };

    return new Promise((resolve, reject) => {
        let token = nJwt.create(
            credentials,
            cryptoHelper.jwtSecret,
        );
        token.setExpiration(dateHelper.getExpiredTokenDate());
        token = cryptoHelper.encrypt(String(token));
        resolve(token);
    });
};
