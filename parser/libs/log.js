'use strict';

var winston = require('winston'),
    ENV = process.env.NODE_ENV;

//require('winston-mongodb').MongoDB;

function getLogger(module) {

    var path = module.filename.split('/').slice(-2).join('/'),
        options = {};

    if(ENV === 'qa') {
        options = {
            transports: [
                new winston.transports.MongoDB({
                    db: 'logging',
                    silent: false,
                    host: 'localhost',
                    safe: true,
                    json: true
                })
            ]
        };
    } else {
        options = {
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    level: 'debug',
                    label: path
                })
            ]
        };
    }

    return  new winston.Logger(options);
}

module.exports = getLogger;