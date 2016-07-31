const express = require('express')
const path = require('path')

const DEV_DIR = '/../../app'
const DIST_DIR = '/../../dist'

exports = module.exports = function (app, env) {
  const staticDir = path.join(__dirname, env === 'prod' ? DIST_DIR : DEV_DIR)

  // Serve static files (dev or dist)
  app.use(express.static(staticDir))
}
