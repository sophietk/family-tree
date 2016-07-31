var cookieParser = require('cookie-parser')
var basicAuth = require('basic-auth-connect')

var user = process.env.AUTH_USER
var password = process.env.AUTH_PASSWORD

exports = module.exports = function (app) {
  app.use(cookieParser())
  if (user && password) {
    app.use(basicAuth(user, password))
  }
}
