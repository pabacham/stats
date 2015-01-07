'use strict';

var mongoose = require('../../libs/db');

var schema = new mongoose.Schema({
    name: {
        type: String
    },
    nameRu: {
        type: String
    },
    currentTeam: {
        type: String
    },
    currentNumber: {
        type: Number
    },
    position: {
        type: String
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    shoots: {
        type: String
    },
    birthDate: {
        type: Date
    },
    country: {
        type: String
    },
    games: {
        type: []
    }
});

module.exports = schema;
