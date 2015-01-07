'use strict';

var config = require('../../config'),
    Nightmare = require('nightmare'),
    url = config.urls.base,
    colors = require('colors');

exports.addGame = function(protocolUrl, next) {
    var model = this;

    new Nightmare()
        .on('loadStarted', function() {
            console.log('Loading a game protocol ' + url + protocolUrl);
        })
        .goto(url + protocolUrl)
        .evaluate(function() {
            var content = $('#content'),
                gameDate = content.find('.header h2').text().split('.')[1].split(','),
                gameHeader = content.find('.gameHeader'),
                seasonId = parseInt(window.location.href.replace('http://en.khl.ru/game/', ''));

            //COMMON GAME INFO
            var game = {
                protocolId: parseInt(window.location.href.replace('http://en.khl.ru/game/'+ seasonId +'/', '')),
                gameDate: new Date(gameDate[0] + gameDate[2]),
                seasonId: seasonId,
                teamAId: parseInt(gameHeader.find('div.teamName.left .logo img').attr('src')
                            .replace('/images/teams/ru/'+ seasonId +'/', '')),
                teamAName: gameHeader.find('div.teamName.left .name').text().split('(')[0],
                teamACoach: gameHeader.find('div.teamName.left .name').text().split('Coach: ')[1],
                teamAGoals: gameHeader.find('.time .counter').text().split(':')[0],
                teamBId: parseInt(gameHeader.find('div.teamName:eq(1) .logo img').attr('src')
                    .replace('/images/teams/ru/266/', '')),
                teamBName: gameHeader.find('div.teamName:eq(1)').text().split('(')[0].trim(),
                teamBCoach: gameHeader.find('div.teamName:eq(1) .name').text().split('Coach: ')[1],
                teamBGoals: parseInt(gameHeader.find('.time .counter').text().split(':')[1]),
                audience: parseInt(gameHeader.find('table.info tbody tr:eq(0) td:eq(1)').text()),
                referee: gameHeader.find('table.info tbody tr:eq(1) td:eq(1)').text().split(','),
                linesmen: gameHeader.find('table.info tbody tr:eq(2) td:eq(1)').text().split(','),
                wasOvertime: gameHeader.find('.time .counter').text().split(':')[1].indexOf('OT') >= 0,
                wasBullets: gameHeader.find('.time .counter').text().split(':')[1].indexOf('SO') >= 0,
                scoringSummary: [],
                playersSummary: {
                    teamA: [],
                    teamB: []
                },
                penaltySummary: []
            };

            //PLAYERS SUMMARY
            window.data_goalies_A.forEach(function(goalie) {
                var player = {
                    number: goalie[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(goalie[1].replace('<a href=\'/players/', '')),
                    playerName: goalie[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'goaltender',
                    gamesPlayed: goalie[2],
                    wins: goalie[3],
                    losses: goalie[4],
                    shotsOnGoal: goalie[5],
                    goalsAllowed: goalie[6],
                    saves: goalie[7],
                    savesP: goalie[8],
                    goalsAgainstAverage: goalie[9],
                    goals: goalie[10],
                    assists: goalie[11],
                    shutouts: goalie[12],
                    penaltyInMins: goalie[13],
                    timeOnIce: goalie[14].split(':')[0] * 60 + parseInt(goalie[14].split(':')[1]),
                    isCaptain: goalie[1].indexOf('(c)') >= 0,
                    isAsistant: goalie[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamA.push(player);
            });

            window.data_defenses_A.forEach(function(defense) {
                var player = {
                    number: defense[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(defense[1].replace('<a href=\'/players/', '')),
                    playerName: defense[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'defense',
                    gamesPlayed: defense[2],
                    goals: defense[3],
                    assists: defense[4],
                    points: defense[5],
                    plusMinus: defense[6],
                    penaltyInMins: defense[7],
                    evenStrengthGoals: defense[8],
                    powerPlayGoals: defense[9],
                    shorthandedGoals: defense[10],
                    overtimeGoals: defense[11],
                    gameWinningGoals: defense[12],
                    shotoutDShots: defense[13],
                    shotsOnGoals: defense[14],
                    shotsOnGoalP: defense[15],
                    faceoffs: defense[16],
                    faceoffsWon: defense[17],
                    faceoffsWonP: defense[18],
                    timeOnIce: defense[19].split(':')[0] * 60 + parseInt(defense[19].split(':')[1]),
                    shifts: defense[20],
                    hits: defense[21],
                    blockedShots: defense[22],
                    foulAgainst: defense[23],
                    isCaptain: defense[1].indexOf('(c)') >= 0,
                    isAsistant: defense[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamA.push(player);
            });

            window.data_forwards_A.forEach(function(forward) {
                var player = {
                    number: forward[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(forward[1].replace('<a href=\'/players/', '')),
                    playerName: forward[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'forward',
                    gamesPlayed: forward[2],
                    goals: forward[3],
                    assists: forward[4],
                    points: forward[5],
                    plusMinus: forward[6],
                    penaltyInMins: forward[7],
                    evenStrengthGoals: forward[8],
                    powerPlayGoals: forward[9],
                    shorthandedGoals: forward[10],
                    overtimeGoals: forward[11],
                    gameWinningGoals: forward[12],
                    shotoutDShots: forward[13],
                    shotsOnGoals: forward[14],
                    shotsOnGoalP: forward[15],
                    faceoffs: forward[16],
                    faceoffsWon: forward[17],
                    faceoffsWonP: forward[18],
                    timeOnIce: forward[19].split(':')[0] * 60 + parseInt(forward[19].split(':')[1]),
                    shifts: forward[20],
                    hits: forward[21],
                    blockedShots: forward[22],
                    foulAgainst: forward[23],
                    isCaptain: forward[1].indexOf('(c)') >= 0,
                    isAsistant: forward[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamA.push(player);
            });

            window.data_goalies_B.forEach(function(goalie) {
                var player = {
                    number: goalie[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(goalie[1].replace('<a href=\'/players/', '')),
                    playerName: goalie[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'goaltender',
                    gamesPlayed: goalie[2],
                    wins: goalie[3],
                    losses: goalie[4],
                    shotsOnGoal: goalie[5],
                    goalsAllowed: goalie[6],
                    saves: goalie[7],
                    savesP: goalie[8],
                    goalsAgainstAverage: goalie[9],
                    goals: goalie[10],
                    assists: goalie[11],
                    shutouts: goalie[12],
                    penaltyInMins: goalie[13],
                    timeOnIce: goalie[14].split(':')[0] * 60 + parseInt(goalie[14].split(':')[1]),
                    isCaptain: goalie[1].indexOf('(c)') >= 0,
                    isAsistant: goalie[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamB.push(player);
            });

            window.data_defenses_B.forEach(function(defense) {
                var player = {
                    number: defense[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(defense[1].replace('<a href=\'/players/', '')),
                    playerName: defense[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'defense',
                    gamesPlayed: defense[2],
                    goals: defense[3],
                    assists: defense[4],
                    points: defense[5],
                    plusMinus: defense[6],
                    penaltyInMins: defense[7],
                    evenStrengthGoals: defense[8],
                    powerPlayGoals: defense[9],
                    shorthandedGoals: defense[10],
                    overtimeGoals: defense[11],
                    gameWinningGoals: defense[12],
                    shotoutDShots: defense[13],
                    shotsOnGoals: defense[14],
                    shotsOnGoalP: defense[15],
                    faceoffs: defense[16],
                    faceoffsWon: defense[17],
                    faceoffsWonP: defense[18],
                    timeOnIce: defense[19].split(':')[0] * 60 + parseInt(defense[19].split(':')[1]),
                    shifts: defense[20],
                    hits: defense[21],
                    blockedShots: defense[22],
                    foulAgainst: defense[23],
                    isCaptain: defense[1].indexOf('(c)') >= 0,
                    isAsistant: defense[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamB.push(player);
            });

            window.data_forwards_B.forEach(function(forward) {
                var player = {
                    number: forward[0].replace(/(<([^>]+)>)/ig, ''),
                    playerId: parseInt(forward[1].replace('<a href=\'/players/', '')),
                    playerName: forward[1].replace(/(<([^>]+)>)/ig, '').split(' (')[0],
                    position: 'forward',
                    gamesPlayed: forward[2],
                    goals: forward[3],
                    assists: forward[4],
                    points: forward[5],
                    plusMinus: forward[6],
                    penaltyInMins: forward[7],
                    evenStrengthGoals: forward[8],
                    powerPlayGoals: forward[9],
                    shorthandedGoals: forward[10],
                    overtimeGoals: forward[11],
                    gameWinningGoals: forward[12],
                    shotoutDShots: forward[13],
                    shotsOnGoals: forward[14],
                    shotsOnGoalP: forward[15],
                    faceoffs: forward[16],
                    faceoffsWon: forward[17],
                    faceoffsWonP: forward[18],
                    timeOnIce: forward[19].split(':')[0] * 60 + parseInt(forward[19].split(':')[1]),
                    shifts: forward[20],
                    hits: forward[21],
                    blockedShots: forward[22],
                    foulAgainst: forward[23],
                    isCaptain: forward[1].indexOf('(c)') >= 0,
                    isAsistant: forward[1].indexOf('(a)') >= 0
                };

                game.playersSummary.teamB.push(player);
            });

            //SCORING SUMMARY
            var goalDetection = 0,
                scoreAsNum;

            window.data_goals.forEach(function(goal) {
                scoreAsNum = parseInt(goal[3].split(':')[0] + goal[3].split(':')[1]);

                var goalObj = {
                    period: goal[1],
                    time: goal[2].split(':')[0] * 60 + parseInt(goal[2].split(':')[1]),
                    score: goal[3],
                    pmg: goal[4],
                    goalScorerId: parseInt(goal[5].replace('<a href=\'/players/', '')),
                    goalScorer: goal[5].replace(/(<([^>]+)>)/ig, '').split('. ')[1].split(' (')[0],
                    assist1Id: parseInt(goal[6].replace('<a href=\'/players/', '')),
                    assist1: goal[6] ? goal[6].replace(/(<([^>]+)>)/ig, '').split('. ')[1].split(' (')[0] : '',
                    assist2Id: parseInt(goal[7].replace('<a href=\'/players/', '')),
                    assist2: goal[7] ? goal[7].replace(/(<([^>]+)>)/ig, '').split('. ')[1].split(' (')[0] : '',
                    teamAonIce: goal[8].replace(/(<([^>]+)>)/ig, '').split(','),
                    teamBonIce: goal[9].replace(/(<([^>]+)>)/ig, '').split(','),
                    teamAScored: scoreAsNum - goalDetection === 10,
                    teamBScored: scoreAsNum - goalDetection === 1
                };

                goalObj.teamAonIce = goalObj.teamAonIce.map(function(playerNumber) {
                    var result = game.playersSummary.teamA.filter(function(player){
                        return player.number === playerNumber;
                    });

                    return result[0] && result[0].playerId;
                });

                goalObj.teamBonIce = goalObj.teamBonIce.map(function(playerNumber) {
                    var result = game.playersSummary.teamB.filter(function(player){
                        return player.number === playerNumber;
                    });

                    return result[0] && result[0].playerId;
                });

                goalDetection += scoreAsNum - goalDetection;

                game.scoringSummary.push(goalObj);
            });

            //PENALTY SUMMARY
            var penaltyTable = content.find('div.section:contains("PENALTY SUMMARY") table tbody tr:not(".group")'),
                penaltySummary = [],
                penalty = {};

            penaltyTable.each(function() {
                if($(this).find('td:eq(0)').is(':empty')) {
                    penalty = {
                        time: $(this).find('td:eq(1)').text().split(':')[0] * 60 + parseInt($(this).find('td:eq(1)').text().split(':')[1]),
                        player: parseInt($(this).find('td:eq(2)').html().replace('<a href="/players/', '')),
                        min: $(this).find('td:eq(3)').text(),
                        penalty: $(this).find('td:eq(4)').text(),
                        team: game.teamBId
                    };
                } else {
                    penalty = {
                        time: $(this).find('td:eq(0)').text().split(':')[0] * 60 + parseInt($(this).find('td:eq(0)').text().split(':')[1]),
                        player: parseInt($(this).find('td:eq(1)').html().replace('<a href="/players/', '')),
                        min: $(this).find('td:eq(2)').text(),
                        penalty: $(this).find('td:eq(3)').text(),
                        team: game.teamAId
                    };
                }

                penaltySummary.push(penalty);
            });

            game.penaltySummary = penaltySummary;

            return game;

        }, function(data) {
            console.log(data.penaltySummary);
        })
        .run();
};