var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    DEV_DIR = '/../../app',
    DIST_DIR = '/../../dist';

exports = module.exports = function (app, env) {

    app.use(favicon(__dirname + DEV_DIR + '/img/favicon.ico'));

    // Serve static files (dev or dist)
    app.use(express.static(path.join(__dirname, env === 'prod' ? DIST_DIR : DEV_DIR)));

};
