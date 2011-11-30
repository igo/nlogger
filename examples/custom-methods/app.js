var logger = require('../../lib/nlogger').logger(module);
var first = require('./my-custom-modules/first');
var second = require('./my-custom-modules/second');
var third = require('./my-custom-modules/third');
var all = require('./my-custom-modules/all');

setTimeout(function() {
  logger.two('Timed log');
}, 1000);

logger.lowest('Not printed'); // too low of priority
logger.mid('Info message');
logger.four('Exiting');

if (logger.isTest) {
  logger.test('runs on logLevel==test only');
}
