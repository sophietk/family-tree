var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer'),
    upload = multer({dest: 'server/upload/avatar/'})
    db = require('../database'),
    lastUpload = {};

exports = module.exports = function (app) {

    app.post('/upload/avatar', upload.single('avatarFile'), function (req, res) {
        console.log(req.body);
        var avatar = {
            name: req.file.filename,
            originalName: req.file.originalname,
            data: new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
            contentType: req.file.mimetype,
            size: req.file.size
        };

        db.createAvatar(avatar)
            .then(function (dbAvatar) {
                res.send({
                    avatarUrl: '/avatar/' + dbAvatar._id
                });
            })
            .fail(function (err) {
                res.status(500).send(err.message)
            });
    });

    app.get('/avatar/:id', function (req, res) {
        var id = req.params.id;

        db.getAvatar(id)
            .then(function (dbAvatar) {
                if (_.isUndefined(dbAvatar)) return res.sendStatus(404);

                res.contentType(dbAvatar.contentType);
                res.send(new Buffer(dbAvatar.data, 'base64'));
            })
            .fail(function (err) {
                res.status(500).send(err.message)
            });
    });

};
