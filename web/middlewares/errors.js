'use strict';
var logger = require('../libs/log')(module),
    cluster = require('cluster');

module.exports = function(err, req, res, next) {

    if (err) {
        logger.error(err.stack);

        // TODO: Redirect user to some static error page.
        // res.redirect('/error');

        // Only exit on cluster mode.
        if (cluster.isWorker) {
            return process.exit();
        }
    }

    return next();
};
