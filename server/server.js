var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    env = process.env.NODE_ENV || 'dev',
    port = Number(process.env.PORT || 3000),
    app = express();

console.log('Sever starting in mode: ' + env);

app.use(logger(env === 'prod' ? 'common' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

require('./static')(app, env);

require('./family')(app);

// Listen
app.listen(port, function () {
    console.log('Listening on port: ' + port);
});

module.exports = app;
