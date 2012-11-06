var logger = require('../../lib/nlogger').logger('my-custom-name',{level:{'*':'warn'}});

logger.info('Because of the runtime cfg, this will be ignored.');
logger.warn('But this is visible. Notice the custom name too :-)');
logger.error('And here is a formated string with a number %d and an object %s',5,require('util').inspect({a:1}));
