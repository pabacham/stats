'use strict';

var mongoose = require('../../libs/db');

var schema = new mongoose.Schema({
    protocolId: {
        type: Number
    },
    gameDate: {
        type: Date
    },
    seasonId: {
        type: Number
    },
    teamAId: {
        type: Number
    },
    teamAName: {
        type: String
    },
    teamACoach: {
        type: String
    },
    teamAGoals: {
        type: Number
    },
    teamBId: {
        type: Number
    },
    teamBName: {
        type: String
    },
    teamBCoach: {
        type: String
    },
    teamBGoals: {
        type: Number
    },
    audience: {
        type: Number
    },
    referee: {
        type: String
    },
    linesmen: {
        type: String
    },
    wasOvertime: {
        type: Boolean
    },
    wasBullets: {
        type: Boolean
    },
    scoringSummary: {
        type: []
    },
    playersSummary: {
        type: {}
    },
    penaltySummary: {
        type: []
    },
    teamsSummary: {
        type: {}
    },
    shots: {
        type: {}
    },
    hits: {
        type: {}
    },
    shootouts: {
        type: []
    }
});

module.exports = schema;
