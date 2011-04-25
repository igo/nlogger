require.paths.unshift('../../lib');

var logger = require('nlogger').logger(module);
var first = require('./my-modules/first');
var second = require('./my-modules/second');
var third = require('./my-modules/third');
var fourth = require('./my-modules/fourth');

setTimeout(function() {
	logger.debug('Timed log');
}, 1000);

logger.info('Info message');
