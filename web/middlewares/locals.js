'use strict';

var config = require('../config');

module.exports = function (req, res, next) {
    res.locals = {
        stats: {
            user: {
                username: 'admin'
            },
            env: process.env.NODE_ENV,
            _csrf: '',
            defaultLanguageKey: 'eng',
            currentLanguageKey: 'eng',
            enabledLanguages: [
                { key: 'eng', name: 'English' }
            ],
            browser: config.browser,
            phpSession: req.phpSession
        }
    };

    return next();
};
