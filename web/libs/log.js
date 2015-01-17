'use strict';

var winston = require('winston');

function getLogger(module) {

    var path = module.filename.split('/').slice(-2).join('/'),
        options = {};

    options = {
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            })
        ]
    };

    return new winston.Logger(options);
}

module.exports = getLogger;
