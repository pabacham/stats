'use strict';

var path = require('path'),
    config = require('./config'),
    express = require('express'),
    app = express(),
    logger = require('./libs/log')(module),
    staticPath = path.join(__dirname, 'public'),
    connectDomain = require('connect-domain'),
    bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(require('cookie-parser')(config.server.cookieSecret));
app.use(express.static(staticPath));

//app.use(require('./middlewares/session').request);

app.use(require('./middlewares/locals'));
require('./modules')(app);
app.use(connectDomain());
app.use(require('./middlewares/errors'));

app.start = function (done) {
    app.listen(config.server.port, function () {
        logger.info('Express server listening on port ' + config.server.port);
        done();
    });
};

app.stop = function (done) {
    done();
};

module.exports = exports = app;
