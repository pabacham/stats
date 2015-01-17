// Original code at http://blog.evantahler.com/blog/production-deployment-with-node-js-clusters.html

'use strict';

var cluster = require('cluster'),
    logger = require('./libs/log')(module),
    numCPUs = require('os').cpus().length,
    numWorkers = numCPUs - 2;

if (numWorkers < 2) {
    numWorkers = 2;
}

logger.info('STARTING CLUSTER');

var workerRestartArray = [],
    workersExpected = 0;

var startAWorker = function () {
    var worker = cluster.fork();
    logger.info('starting worker #' + worker.id);
    worker.on('message', function (message) {
        if (worker.state !== 'none') {
            logger.info('Message [' + worker.process.pid + ']: ' + message);
        }
    });
    worker.send('start');
};

var loopUntilNoWorkers = function () {
    if (cluster.workers.length > 0) {
        logger.info('there are still ' + cluster.workers.length + ' workers...');
        setTimeout(loopUntilNoWorkers, 1000);
    } else {
        logger.info('all workers gone');
        process.exit();
    }
};

var setupShutdown = function () {
    logger.info('Cluster manager quitting');
    logger.info('Stopping each worker...');

    for (var i in cluster.workers) {
        if(cluster.workers.hasOwnProperty(i)) {
            cluster.workers[i].send('stop');
        }
    }


    setTimeout(loopUntilNoWorkers, 1000);
};

var reloadAWorker = function () {
    var count = cluster.workers.length;

    if (workersExpected > count) {
        startAWorker();
    }

    if (workerRestartArray.length > 0) {
        var worker = workerRestartArray.pop();
        worker.send('stop');
    }
};

cluster.setupMaster({
    exec: __dirname + '/worker.js'
});

for (var i = 0; i < numWorkers; i++) {
    workersExpected++;
    startAWorker();
}

cluster.on('fork', function (worker) {
    logger.info('worker ' + worker.process.pid + ' (#' + worker.id + ') has spawned');
});

cluster.on('exit', function (worker) {
    logger.info('worker ' + worker.process.pid + ' (#' + worker.id + ') has exited');

    // to prevent CPU-splsions if crashing too fast
    setTimeout(reloadAWorker, 1000);
});

process.on('SIGINT', function () {
    logger.info('Signal: SIGINT');
    workersExpected = 0;
    setupShutdown();
});

process.on('SIGTERM', function () {
    logger.info('Signal: SIGTERM');
    workersExpected = 0;
    setupShutdown();
});

process.on('SIGUSR2', function () {
    logger.info('Signal: SIGUSR2');
    logger.info('swap out new workers one-by-one');
    workerRestartArray = [];
    for (var i in cluster.workers) {
        if(cluster.workers.hasOwnProperty(i)) {
            workerRestartArray.push(cluster.workers[i]);
        }
    }
    reloadAWorker();
});

process.on('SIGWINCH', function () {
    logger.info('Signal: SIGWINCH');
    logger.info('stop all workers');
    workersExpected = 0;
    for (var i in cluster.workers) {
        if(cluster.workers.hasOwnProperty(i)) {
            var worker = cluster.workers[i];
            worker.send('stop');
        }
    }
});

process.on('SIGTTIN', function () {
    logger.info('Signal: SIGTTIN');
    logger.info('add a worker');
    workersExpected++;
    startAWorker();
});

process.on('SIGTTOU', function () {
    logger.info('Signal: SIGTTOU');
    logger.info('remove a worker');
    workersExpected--;

    for (var i in cluster.workers) {
        if(cluster.workers.hasOwnProperty(i)) {
            var worker = cluster.workers[i];
            worker.send('stop');
            break;
        }
    }
});

process.on('exit', function () {
    workersExpected = 0;
    logger.info('Bye!');
});
