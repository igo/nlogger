nlogger
===========

nlogger is a Node.js logging library that can

* print messages with module name and current line number so you know from where it was called
* print messages in color
* print parameters in message
* be configured from file


Usage
-----
Use npm or download. Then add to your code:

	var logger = require('nlogger').logger(module);

*module* is object defined automatically by Node.js. If you don't want automatic module names, replace it with your desired string name.

	logger.info(message);
	logger.info(message, variable, message, variable...);

Examples
--------

	var logger = require('nlogger').logger(module);
	logger.info('Info message');
	logger.debug('Debug message');
	logger.warn('Warning message');
	logger.error('Error message');
	logger.trace('Trace message');
	logger.info('Array = ', [1, 2, 3, 4], ', Object = ', {one: 1, two: 2});

	
Output samples
--------------

	2010-10-02 20:39:03.570 INFO  main:5 - Info message
	2010-10-02 20:39:03.588 DEBUG main:6 - Debug message
	2010-10-02 20:39:03.589 WARN  main:7 - Warning message
	2010-10-02 20:39:03.590 ERROR main:8 - Error message
	2010-10-02 20:39:03.590 TRACE main:9 - Trace message
	2010-10-02 20:39:03.590 INFO  main:10 - Array = [ 1, 2, 3, 4 ], Object = { one: 1, two: 2 }
	
	2010-10-02 20:59:12.496 INFO  my-modules/first:3 - Message from first module from line #3
	2010-10-02 20:59:12.514 INFO  my-modules/second:10 - Message from second module from line #10
	2010-10-02 20:59:12.515 INFO  fake-module-name:3 - Message from third module from line #3
	2010-10-02 20:59:12.516 INFO  <unknown>:3 - Message from fourth module from line #3
	

Configuration
-------------
nlogger can load optional configuration file nlogger.json which looks like:

	{
		"color": "auto",
		"level": {
			"*": "debug",
			"my-modules/first": "info"
		}
	}
	
* `color` - print message in color? [true, false, "auto"]
* `level.*` - default debug level
* `level.yourModuleName` - debug level for specified module

Possible debug levels are `trace`, `debug`, `info`, `warn`, `error`.

Changes
-------
0.4.0 - Logging methods parameters changed

0.3.1 - Fixed util dependencies

0.3.0 - Added parameters support to logging methods

0.2.0 - Added configuration file support

0.1.0 - First npm release


License
-------
Released under MIT License. Enjoy and Fork!
