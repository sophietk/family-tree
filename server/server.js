var express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  env = process.env.NODE_ENV || 'dev',
  port = Number(process.env.PORT) || 3000,
  app = express()

console.log('Server starting in mode: ' + env)

app.use(logger(env === 'prod' ? 'common' : 'dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

require('./static')(app, env)

require('./authentication')(app)

require('./family')(app)

require('./upload')(app)

// Listen
app.listen(port, function () {
  console.log('Listening on port: ' + port)
})

module.exports = app
