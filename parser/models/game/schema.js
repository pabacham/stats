'use strict';

var mongoose = require('../../libs/db');

var schema = new mongoose.Schema({
    name: {
        type: String
    }
});

module.exports = schema;
