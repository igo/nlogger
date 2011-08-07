var logger = require('nlogger').logger(module);

logger.info('Message from first module from line #3');
logger.debug({one: 1, two: 2});

logger.info('Message with {} parameters. Works also with objects {}. Cool!', 'some', { a: 1, b: 2 });
logger.info('One = {}, two = {}, 3 = {}, four = {}', 1, 2, 'three', 4);
logger.info('Array = {}, Object = {}', [1, 2, 3, 4], {one: 1, two: 2});

try {
	throw new Error('Throwing sample error');
} catch(e) {
	logger.error('Something went wrong! Catched {}', e.message);
}
