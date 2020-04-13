const fs = require('fs');

const File = require('../models/file.model');

module.exports.getAll = function(req, res, next) {
    const { params, query } = req;

    File.getAll({ params, query }, async (data) => {
        if(params.id) {
            return res.json({ success: true, file: data[0] }).status(200);
        }
        return res.json({ success: true, data }).status(200);
    });
};

module.exports.upload = function(req, res, next) {
    const { originalname, filename, mimetype } = req.file;

    const file = new File({
        name: filename,
        originalName: originalname,
        ext: originalname.split('.').reverse()[0],
        mimeType: mimetype
    });
    File.create(file, (id) => {
        return res.json({
            success: true,
            id,
        }).status(200);
    });
};

module.exports.update = function(req, res, next) {
    const { id } = req.params;
    const { originalname, filename, mimetype } = req.file;

    File.getAll({ params: { id }, query: {} }, async (files) => {
        const file = files[0];

        fs.unlink(`./uploads/${file.name}`, (err) => {
            const file = new File({
                name: filename,
                originalName: originalname,
                ext: originalname.split('.').reverse()[0],
                mimeType: mimetype
            });
            file.id = id;
            File.update(file, () => {
                return res.json({
                    success: true,
                    id,
                }).status(200);
            });
        });
    });
};

module.exports.delete = function(req, res, next) {
    const { id } = req.params;

    File.getAll({ params: { id }, query: {} }, async (files) => {
        const file = files[0];

        fs.unlink(`./uploads/${file.name}`, (err) => {
            File.delete(id, () => {
                return res.json({
                    success: true,
                    id,
                }).status(200);
            });
        });
    });
};

module.exports.download = function(req, res, next) {
    const { id } = req.params;

    File.getAll({ params: { id }, query: {} }, async (files) => {
        const file = files[0];
        res.download(`./uploads/${file.name}`);
    });
};
