var cookieParser = require('cookie-parser'),
  basicAuth = require('basic-auth-connect'),
  user = process.env.AUTH_USER,
  password = process.env.AUTH_PASSWORD

exports = module.exports = function (app) {

  app.use(cookieParser())
  if (user && password) {
    app.use(basicAuth(user, password))
  }

}
