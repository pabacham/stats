'use strict';

var fs = require('fs'),
    path = require('path'),
    ini = require('ini'),
    logger = require('../libs/log')(module),
    _ = require('lodash'),
    env = process.env.NODE_ENV;

var iniFile = path.join(__dirname, 'common.ini'),
    content, config;

// This module is an IIFE.
module.exports = (function () {
    // If configuration file is already loaded do no attempt to read it again.
    if (config) {
        return config;
    }

    logger.info('loading ' + iniFile);

    try {
        // Open config file usint UTF-8, otherwise will be opened as stream.
        // Using sync reading as this is only done once and we do not want to
        // have to wrap all the code that needs this on a callback.
        content = fs.readFileSync(iniFile, 'utf-8');
    } catch (err) {
        // If file cannot be read nothing else can be done, therefore finish
        // the execution.
        logger.error('unable to read ini file!');
        process.exit(1);
        return null;
    }

    // All set, save the object for future usage and return results.
    config = ini.decode(content);

    if (fs.existsSync(path.join(__dirname, env + '.ini'))) {
        var overridenContent = fs.readFileSync(path.join(__dirname, env + '.ini'), 'utf-8'),
            overridenConfig = ini.decode(overridenContent);
        _.assign(config, overridenConfig);
    }

    logger.info('configuration successfully loaded');
    return config;
}());
