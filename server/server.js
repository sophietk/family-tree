const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const env = process.env.NODE_ENV || 'dev'
const port = Number(process.env.PORT) || 3000
const app = express()

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
