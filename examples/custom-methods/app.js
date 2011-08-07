require.paths.unshift('../../lib');

var logger = require('nlogger').logger(module);
var first = require('./my-custom-modules/first');
var second = require('./my-custom-modules/second');
var third = require('./my-custom-modules/third');

setTimeout(function() {
	logger.two('Timed log');
}, 1000);

logger.lowest('Not printed'); // too low of priority
logger.mid('Info message');
logger.four('Exiting');
