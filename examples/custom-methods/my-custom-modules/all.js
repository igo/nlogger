var logger = require('../../../lib/nlogger').logger(module);

logger.test("test");
logger.lowest("lowest");
logger.two("two");
logger.mid("mid");
logger.four("four");
logger.highest("highest");

if (logger.isTest) {
  logger.test("Priority: " + logger.priority);
  logger.test("level: "    + logger.level);
  logger.test("levelKey: " + logger.levelKey);
}
