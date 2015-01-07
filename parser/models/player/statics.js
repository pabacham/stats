'use strict';

var config = require('../../config'),
    Nightmare = require('nightmare'),
    url = config.urls.player,
    colors = require('colors');

exports.addPlayer = function(playerId, next) {
    var model = this;

    new Nightmare()
        .on('loadStarted', function() {
            console.log('Loading a player page id #' + playerId);
        })
        .goto(url + playerId + '/games/all/all/')
        .evaluate(function() {
            var section = $('.borderdiv table tbody'),
                ul = section.find('tr:eq(1) td:eq(0) ul'),
                player = {
                    name: section.find('tr:eq(0) td:eq(1) h2').html().split('<br>')[1],
                    nameRu: section.find('tr:eq(0) td:eq(1) h2').html().split('<br>')[0],
                    currentTeam: ul.find('li:eq(0)').html(),
                    currentNumber: ul.find('li:eq(1)').html(),
                    position: ul.find('li:eq(2)').html(),
                    height: ul.find('li:eq(3)').html(),
                    weight: ul.find('li:eq(4)').html(),
                    shoots: ul.html().split('Shoots: <b>')[1],
                    birthDate: ul.find('li:eq(5)').html(),
                    country: ul.html().split('Country: <b>')[1],
                    games: []
                };
            player.currentTeam = player.currentTeam
                                    .replace(player.currentTeam.substring(0, player.currentTeam.indexOf('>')+1), '')
                                    .replace('</b>', '');
            player.currentNumber = player.currentNumber
                .replace(player.currentNumber.substring(0, player.currentNumber.indexOf('>')+1), '')
                .replace('</b>', '');

            player.position = player.position
                .replace(player.position.substring(0, player.position.indexOf('>')+1), '')
                .replace('</b>', '');

            player.height = player.height
                .replace(player.height.substring(0, player.height.indexOf('>')+1), '')
                .replace('</b>', '');

            player.weight = player.weight
                .replace(player.weight.substring(0, player.weight.indexOf('>')+1), '')
                .replace('</b>', '');

            player.shoots = player.shoots.substr(0, player.shoots.indexOf('</b>'));

            player.birthDate = player.birthDate
                .replace(player.birthDate.substring(0, player.birthDate.indexOf('>')+1), '')
                .replace('</b>', '');
            player.birthDate = new Date(player.birthDate);

            player.country = player.country.substr(0, player.country.indexOf('</b>'));

            $('select[name="gTable_length"]').val(-1);
            $('select[name="gTable_length"]').change();

            //filling in games property
            $('#gTable tbody tr').each(function() {
                if(!$(this).hasClass('group')) {
                    var col1 = $(this).find('td:eq(0)');

                    if(col1.hasClass('dataTables_empty')) {
                        return false;
                    }

                    var datePattern = /(\d{2})\.(\d{2})\.(\d{4})/,
                        col2 = $(this).find('td:eq(1)').html(),
                        seasonId = parseInt(col2.split(' - ')[0].replace('<a href="/stat/players/', '')),
                        col3 = $(this).find('td:eq(2)').html(),
                        col20 = $(this).find('td:eq(20)').text(),
                        col15 = $(this).find('td:eq(15)').text();

                    var game = {
                        seasonId: seasonId,
                        gameDate: new Date(col1.text().replace(datePattern,'$3-$2-$1')),
                        gameProtocolId: parseInt(col3.replace('<a href="/game/'+ seasonId +'/', '')),
                        teamAId: parseInt(col2.split(' - ')[0].replace('<a href="/stat/players/' + seasonId + '/all/', '')),
                        teamAName: col2.split(' - ')[0]
                            .substring(col2.split(' - ')[0].indexOf('/">') + 3, col2.split(' - ')[0].indexOf('</a>'))
                            .replace(/(<([^>]+)>)/ig, ''),
                        teamBId: parseInt(col2.split(' - ')[1].replace('<a href="/stat/players/' + seasonId + '/all/', '')),
                        teamBName: col2.split(' - ')[1]
                            .substring(col2.split(' - ')[1].indexOf('/">') + 3, col2.split(' - ')[1].indexOf('</a>'))
                            .replace(/(<([^>]+)>)/ig, ''),
                        playerTeam: col2.substring(col2.indexOf('<strong>') + 8, col2.indexOf('</strong>')),
                        teamAScore: col3.split(':')[0].replace(/(<([^>]+)>)/ig, ''),
                        teamBScore: parseInt(col3.split(':')[1]),
                        wasOvertime: col3.indexOf('ОТ') >= 0,
                        wasBullets: col3.indexOf('Б') >= 0,
                        playerNumber: $(this).find('td:eq(3)').text(),
                        isAsistant: col2.indexOf('(a)') >= 0,
                        isCaptain: col2.indexOf('(c)') >= 0,
                        stats: {
                            goals: $(this).find('td:eq(4)').text(),
                            assists: $(this).find('td:eq(5)').text(),
                            points: $(this).find('td:eq(6)').text(),
                            plusMinus: $(this).find('td:eq(7)').text(),
                            penaltyInMins: $(this).find('td:eq(8)').text(),
                            evenStrengthGoals: $(this).find('td:eq(9)').text(),
                            powerPlayGoals: $(this).find('td:eq(10)').text(),
                            shorthandedGoals: $(this).find('td:eq(11)').text(),
                            overtimeGoals: $(this).find('td:eq(12)').text(),
                            gameWinningGoals: $(this).find('td:eq(13)').text(),
                            shotoutDShots: $(this).find('td:eq(14)').text(),
                            shotsOnGoals: $(this).find('td:eq(15)').text(),
                            shotsOnGoalP: $(this).find('td:eq(16)').text(),
                            faceoffs: $(this).find('td:eq(17)').text(),
                            faceoffsWon: $(this).find('td:eq(18)').text(),
                            faceoffsWonP: $(this).find('td:eq(19)').text(),
                            timeOnIce: col20.split(':')[0] * 60 + parseInt(col20.split(':')[1]),
                            shifts: $(this).find('td:eq(21)').text(),
                            hits: $(this).find('td:eq(22)').text(),
                            blockedShots: $(this).find('td:eq(23)').text(),
                            foulAgainst: $(this).find('td:eq(24)').text()
                        }
                    };

                    if(player.position === 'goaltender') {
                        game.stats = {
                            wins: $(this).find('td:eq(4)').text(),
                            losses: $(this).find('td:eq(5)').text(),
                            shotsOnGoal: $(this).find('td:eq(6)').text(),
                            goalsAllowed: $(this).find('td:eq(7)').text(),
                            saves: $(this).find('td:eq(8)').text(),
                            savesP: $(this).find('td:eq(9)').text(),
                            goalsAgainstAverage: $(this).find('td:eq(10)').text(),
                            goals: $(this).find('td:eq(11)').text(),
                            assists: $(this).find('td:eq(12)').text(),
                            shutouts: $(this).find('td:eq(13)').text(),
                            penaltyInMins: $(this).find('td:eq(14)').text(),
                            timeOnIce: col15.split(':')[0] * 60 + parseInt(col15.split(':')[1])
                        };
                    }

                    player.games.push(game);
                }
            });

            return player;
        }, function(data) {
            if(data) {
                model.addItem(data, function(err, res) {
                    if(err) {
                        console.log(err);
                        return next && next(err);
                    }

                    console.log(colors.green(res.name + ' was added to the DB'));
                    next && next();
                });
            }
        })
        .run();
};