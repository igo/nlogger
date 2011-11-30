var logger = require('../../../lib/nlogger').logger(module);

logger.mid('Message from first module from line #3');
logger.two({one: 1, two: 2});

logger.mid('Message with {} parameters. Works also with objects {}. Cool!', 'some', { a: 1, b: 2 });
logger.mid('One = {}, two = {}, 3 = {}, four = {}', 1, 2, 'three', 4);
logger.mid('Array = {}, Object = {}', [1, 2, 3, 4], {one: 1, two: 2});

try {
  throw new Error('Throwing sample error');
} catch(e) {
  logger.highest('Something went wrong! Catched {}', e.message);
}
