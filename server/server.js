var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    env = process.env.NODE_ENV || 'dev',
    port = Number(process.env.PORT || 3000),
    app = express();

app.use(favicon(__dirname + '/../app/img/favicon.ico'));
app.use(logger(env === 'prod' ? 'common' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

console.log('Sever started in mode: ' + env);

// Serve static files (dev or dist)
app.use(express.static(path.join(__dirname, env === 'prod' ? '../dist' : '../app')));

// Listen
app.listen(port, function () {
    console.log('Listening on port: ' + port);
});

module.exports = app;
