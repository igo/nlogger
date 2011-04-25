nlogger
===========

nlogger (formerly node-logger) is a Node.js logging library that prints module name, current line number and also your messages :) Furthermore it gives you an option to print messages in color.


Usage
-----
Download and add to your code:

	var logger = require('nlogger').logger(module [, useColor]);

*module* is object defined automatically by nodejs. Don't bother with it, just always type *module*.

Examples
--------

	var logger = require('nlogger').logger(module);
	logger.info('Info message');
	logger.debug('Debug message');
	logger.warn('Warning message');
	logger.error('Error message');
	logger.trace('Trace message');

To print messages in color init logger with useColor set to true:

	var logger = require('nlogger').logger(module, true);

	
Output samples
--------------

	2010-10-02 20:39:03.570 INFO  main:5 - Info message
	2010-10-02 20:39:03.588 DEBUG main:6 - Debug message
	2010-10-02 20:39:03.589 WARN  main:7 - Warning message
	2010-10-02 20:39:03.590 ERROR main:8 - Error message
	2010-10-02 20:39:03.590 TRACE main:9 - Trace message
	
	2010-10-02 20:59:12.496 INFO  my-modules/first:3 - Message from first module from line #3
	2010-10-02 20:59:12.514 INFO  my-modules/second:10 - Message from second module from line #10
	2010-10-02 20:59:12.515 INFO  fake-module-name:3 - Message from third module from line #3
	2010-10-02 20:59:12.516 INFO  <unknown>:3 - Message from fourth module from line #3
	

License
-------
Released under MIT License. Enjoy and Fork!
