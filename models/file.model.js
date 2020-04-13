const sql = require('./db.js');

const File = function(file) {
    this.name = file.name;
    this.originalName = file.originalName;
    this.ext = file.ext;
    this.mimeType = file.mimeType;
    this.createdAt = new Date();
    this.updatedAt = new Date();
};

File.getAll = function getAllFiles(req, result) {
    const { params } = req;
    const { list_size = 10, page = 1 } = req.query;

    const criteria = (Object.keys(params).length ? `WHERE ?` : ``)
        .concat(` LIMIT ${(page - 1) * list_size},${list_size}`);

    sql.query(`SELECT * FROM Files ${criteria}`, params, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            const data = Object.assign({ list_size, page }, res);
            result(data);
        }
    });
};

File.create = function createFile(file, result) {
    sql.query("INSERT INTO Files SET ?", file, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result();
        }
        else {
            result(res.insertId);
        }
    });
};

File.update = function updateFile(file, result) {
    sql.query(`UPDATE
                Files
                SET name = '${file.name}',
                    originalName = '${file.originalName}',
                    ext = '${file.ext}',
                    mimeType = '${file.mimeType}',
                    updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?`, file.id, function (err, res) {

        if(err) {
            console.log("error: ", err);
            result();
        }
        else {
            result(res);
        }
    });
};

File.delete = function removeFileById(id, result){
    sql.query("DELETE FROM Files WHERE id = ?", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null);
        }
        else {
            result(id);
        }
    });
};

module.exports = File;
