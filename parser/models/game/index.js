'use strict';

var mongoose = require('mongoose'),
    schema = require('./schema'),
    _ = require('lodash'),
    mongooseUtils = require('../../libs/mongoose-utils');

schema.plugin(mongooseUtils);

_.extend(schema.statics, require('./statics'));

module.exports = mongoose.model('Game', schema);
