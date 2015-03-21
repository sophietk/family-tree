var fs = require('fs'),
    path = require('path'),
    multer = require('multer'),
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
            lastUpload = file.name;
            done = true;
        }
    }));

    app.get('/avatar/:fileName', function (req, res) {
        var fileName = req.params.fileName,
            img = fs.readFileSync(path.resolve(__dirname, './avatar/', fileName));
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(img, 'binary');
    });

    app.post('/upload/avatar', function (req, res) {
        if (done === true) {
            res.send({
                avatarUrl: '/avatar/' + lastUpload
            });
        }
    });

};
