var logger = require('../lib/nlogger').logger(module);
var first = require('./my-modules/first');
/**
 * Example with runtime config - see module code
 */
var second = require('./my-modules/runtime-config');
var third = require('./my-modules/third');

setTimeout(function() {
	logger.debug('Timed log');
}, 1000);

logger.info('Info message');
logger.warn('Exiting');
