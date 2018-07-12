const cookieParser = require('cookie-parser')
const basicAuth = require('basic-auth-connect')

const secret = process.env.APP_SECRET
const isProtected = !!process.env.ACCESS_USERS
const accessUsers = isProtected ? process.env.ACCESS_USERS.split(';').map(user => {
  const userStones = user.split(':')
  return {username: userStones[0], password: userStones[1], family: userStones[2]}
}) : []

exports = module.exports = function (app) {
  app.use(cookieParser())

  if (isProtected) {
    app.use(basicAuth(function (username, password) {
      return accessUsers.some(user => user.username === username && user.password === password)
    }))
  }

  app.use((req, res, next) => {
    req.family = accessUsers.find(user => user.username === req.user).family
    next()
  })

}
