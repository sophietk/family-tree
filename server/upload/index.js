var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer'),
    db = require('../database'),
    done = false,
    lastUpload;

exports = module.exports = function (app) {

    app.use(multer({
        dest: path.resolve(__dirname, './avatar'),
        rename: function (fieldname, filename) {
            return Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
            done = false;
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            lastUpload = file;
            done = true;
        }
    }));

    app.post('/upload/avatar', function (req, res) {
        var avatar = {
            name: lastUpload.name,
            extension: lastUpload.extension,
            originalName: lastUpload.originalname,
            data: new Buffer(fs.readFileSync(lastUpload.path)).toString('base64'),
            contentType: lastUpload.mimetype,
            size: lastUpload.size
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
