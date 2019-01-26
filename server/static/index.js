const express = require('express')
const path = require('path')

const DEV_DIR = '/../../app'
const DIST_DIR = '/../../dist'

exports = module.exports = (app, env) => {
  const staticDir = path.join(__dirname, env === 'production' ? DIST_DIR : DEV_DIR)

  // Serve static files (dev or dist)
  app.use(express.static(staticDir))
}
