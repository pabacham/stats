'use strict';

var mongoose = require('./libs/db'),
    Nightmare = require('nightmare'),
    config = require('./config'),
    gameModel = require('./models/game'),
    async = require('async'),
    url = config.urls.games;



new Nightmare()
    .on('loadStarted', function() {
        console.log('Now loading a new page...');
    })
    .on('onConsoleMessage', function(val) {
        console.log(val);
    })
    .goto(url)
    .evaluate(function() {
        var protocolUrl,
            data = [];

        $('#content div.matches:eq(0)').each(function() {
            $(this).find('div.match').each(function() {
                protocolUrl = $(this).find('.translate .expand ul li:eq(0) a').attr('href');
                if(protocolUrl) {
                    data.push(protocolUrl);
                }
            });
        });

        return data;

    }, function(data) {
        async.each(data, function(url, next) {
            gameModel.addGame(url, next);
        }, function(err) {
            if(err) {
                return console.log(err);
            }

            mongoose.connection.close();
        });
    })
    .run(function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('load finished');
    });



