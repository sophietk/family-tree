var express = require('express')
var path = require('path')

var DEV_DIR = '/../../app'
var DIST_DIR = '/../../dist'

exports = module.exports = function (app, env) {
  var staticDir = path.join(__dirname, env === 'prod' ? DIST_DIR : DEV_DIR)

  // Serve static files (dev or dist)
  app.use(express.static(staticDir))
}
