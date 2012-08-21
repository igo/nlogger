var logger = require('../lib/nlogger').logger(module);
var first = require('./my-modules/first');
var second = require('./my-modules/second');
var third = require('./my-modules/third');

setTimeout(function() {
	logger.debug('Timed log');
}, 1000);

logger.info('Info message');
logger.warn('Exiting');
