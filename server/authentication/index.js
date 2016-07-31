const cookieParser = require('cookie-parser')
const basicAuth = require('basic-auth-connect')

const user = process.env.AUTH_USER
const password = process.env.AUTH_PASSWORD

exports = module.exports = function (app) {
  app.use(cookieParser())
  if (user && password) {
    app.use(basicAuth(user, password))
  }
}
