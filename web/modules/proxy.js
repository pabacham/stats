'use strict';

var router = require('express').Router(),
    request = require('request'),
    config = require('../config'),
    _ = require('lodash');

router.route(config.browser.ajaxProxy + '/*')
    .all(function (req, res) {
        var url = config.api.url + req.url.replace(config.browser.ajaxProxy, ''),
            body = req.body,
            method = req.method,
            auth = {
                user: config.api.username,
                pass: config.api.password
            },
            params = {
                auth: auth,
                method: method,
                url: url,
                jar: false,
                pool: false
            };

        if (method.toLowerCase() !== 'get' && !_.isEmpty(body)) {
            params.json = body;
        }

        request(params).pipe(res);
    });

module.exports = router;
