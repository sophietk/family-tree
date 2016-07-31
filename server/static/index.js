var express = require('express'),
  path = require('path'),
  DEV_DIR = '/../../app',
  DIST_DIR = '/../../dist'

exports = module.exports = function (app, env) {
  var staticDir = path.join(__dirname, env === 'prod' ? DIST_DIR : DEV_DIR)

  // Serve static files (dev or dist)
  app.use(express.static(staticDir))
}
