const sql = require('./db.js');

const User = function(user) {
    this.id = user.id;
    this.password = user.password;
};

User.getById = function getUserById(userId, result) {
    sql.query("SELECT * FROM Users WHERE id = ? ", userId, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null);
        }
        result(res[0]);
    });
};

User.create = function createUser(user, result) {
    sql.query("INSERT INTO Users SET ?", user, function (err, res) {
        if(err) {
            console.log("error: ", err);
        }
        result(res.insertId);
    });
};

module.exports = User;
