const sql = require('./db.js');
const dateHelper = require('../helpers/date');

const Session = function(session) {
    this.userId = session.userId;
    this.accessToken = session.accessToken;
    this.refreshToken = session.refreshToken;
    this.expiresIn = dateHelper.getExpiresInDate();
    this.createdAt = new Date();
};

Session.create = function createSession(session, result) {
    sql.query("INSERT INTO Sessions SET ?", session, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result(res.insertId);
        }
    });
};

Session.updateExpiresInDate = function updateExpiresInDate(session, result) {
    const nextExpiresInDate = dateHelper.getExpiresInDate();

    sql.query(`UPDATE Sessions
                SET expiresIn = '${nextExpiresInDate}'
                WHERE refreshToken = ?`, session.refreshToken, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result(res);
        }
    });
};

Session.findByAccessToken = function findByAccessToken(accessToken, result) {
    sql.query("SELECT * FROM Sessions WHERE accessToken = ? ", accessToken, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result((res && res[0]) || null);
        }
    });
};

Session.findByRefreshToken = function findByRefreshToken(refreshToken, result) {
    sql.query("SELECT * FROM Sessions WHERE refreshToken = ? ", refreshToken, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result((res && res[0]) || null);
        }
    });
};

Session.delete = function removeSessionByToken(accessToken, result){
    sql.query("DELETE FROM Sessions WHERE accessToken = ?", [accessToken], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result(accessToken);
        }
    });
};

module.exports = Session;
