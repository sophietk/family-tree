var fs = require('fs')
var multer = require('multer')
var db = require('../database')

var upload = multer({dest: 'server/upload/avatar/'})

exports = module.exports = function (app) {
  app.post('/upload/avatar', upload.single('avatarFile'), function (req, res) {
    console.log(req.body)
    var avatar = {
      name: req.file.filename,
      originalName: req.file.originalname,
      data: new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
      contentType: req.file.mimetype,
      size: req.file.size
    }

    db.createAvatar(avatar)
      .then(function (dbAvatar) {
        res.send({
          avatarUrl: '/avatar/' + dbAvatar._id
        })
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })

  app.get('/avatar/:id', function (req, res) {
    var id = req.params.id

    db.getAvatar(id)
      .then(function (dbAvatar) {
        if (dbAvatar === undefined) return res.sendStatus(404)

        res.contentType(dbAvatar.contentType)
        res.send(new Buffer(dbAvatar.data, 'base64'))
      })
      .catch(function (err) {
        res.status(500).send(err.message)
      })
  })
}
