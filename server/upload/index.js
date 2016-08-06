const fs = require('fs')
const multer = require('multer')
const db = require('../database')

const upload = multer({dest: 'server/upload/avatar/'})

exports = module.exports = function (app) {
  app.post('/upload/avatar', upload.single('avatarFile'), function (req, res) {
    console.log(req.body)
    const avatar = {
      name: req.file.filename,
      originalName: req.file.originalname,
      data: new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
      contentType: req.file.mimetype,
      size: req.file.size
    }

    db.createAvatar(avatar)
      .then(dbAvatar => {
        res.send({
          avatarUrl: `/avatar/${dbAvatar._id}`
        })
      })
      .catch(err => {
        res.status(500).send(err.message)
      })
  })

  app.get('/avatar/:id', function (req, res) {
    const id = req.params.id

    db.getAvatar(id)
      .then(dbAvatar => {
        if (dbAvatar === undefined) return res.sendStatus(404)

        res.contentType(dbAvatar.contentType)
        res.send(new Buffer(dbAvatar.data, 'base64'))
      })
      .catch(err => {
        res.status(500).send(err.message)
      })
  })
}
