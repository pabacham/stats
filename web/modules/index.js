'use strict';

module.exports = function (app) {
    app.use('/', require('./proxy'));
    app.use('/', require('./stats'));
};
