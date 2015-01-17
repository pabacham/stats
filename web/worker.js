// Original code at http://blog.evantahler.com/blog/production-deployment-with-node-js-clusters.html

'use strict';

var app = require('./app'),
    logger = require('./libs/log')(module),
    cluster = require('cluster');

var startServer = function (next) {
    if (cluster.isWorker) {
        process.send('starting');
    }

    app.start(function () {
        logger.info('Boot Sucessful @ worker #' + process.pid);
        next();
    });
};

if (cluster.isWorker) {
    process.on('message', function (msg) {
        if (msg === 'start') {
            process.send('starting');
            startServer(function () {
                process.send('started');
            });
        }

        if (msg === 'stop') {
            process.send('stopping');
            app.stop(function () {
                process.send('stopped');
                process.exit();
            });
        }
    });
} else {
    startServer(function () {
        logger.info('Successfully Booted!');
    });
}
