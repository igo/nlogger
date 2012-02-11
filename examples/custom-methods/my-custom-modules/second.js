var logger = require('../../../lib/nlogger').logger('customName');

logger.mid('Message from second module with defined module name');
logger.lowest("Second file with module name: 'customName'!");
