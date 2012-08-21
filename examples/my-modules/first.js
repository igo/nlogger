var logger = require('../../lib/nlogger').logger(module);

logger.info('Message from first module from line #3');
logger.debug({one: 1, two: 2});

logger.info('Message with ', 'some', ' parameters. Works also with objects ', { a: 1, b: 2 }, '. Cool!');
logger.info('Array = ', [1, 2, 3, 4], ', Object = ', {one: 1, two: 2});

try {
	throw new Error('Throwing sample error');
} catch(e) {
	logger.error('Something went wrong! Catched ', e.message);
}
