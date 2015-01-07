'use strict';

var mongoose = require('./libs/db'),
    Nightmare = require('nightmare'),
    config = require('./config'),
    playerModel = require('./models/player'),
    async = require('async'),
    url = config.urls.players;



new Nightmare()
    .on('loadStarted', function() {
        console.log('Now loading a new page...');
    })
    .on('onConsoleMessage', function(val) {
        console.log(val);
    })
    .goto(url)
    .wait('#content table.typical')
    .evaluate(function() {
        var playerId,
            data = [];

        $('#content table.typical').each(function() {
            $(this).find('tbody tr').each(function() {
                playerId = $(this).find('td').eq(2).find('div a').attr('href').replace(/[^0-9]/g,'');
                data.push(playerId);
            });
        });

        return data;

    }, function(ids) {
        async.each(ids, function(id, next) {
            playerModel.addPlayer(id, next);
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



