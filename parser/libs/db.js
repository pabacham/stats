'use strict';

var mongoose = require('mongoose'),
    logger = require('./log')(module),
    config = require('../config');

if (config.mongodb.debug) {
    mongoose.set('debug', function (collectionName, method, query, doc) {
        logger.info(collectionName, method, query, doc);
    });
}

mongoose.connect('mongodb://'+ config.mongodb.host +'/' + config.mongodb.db, {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
});

module.exports = mongoose;
