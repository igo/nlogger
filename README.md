spruce
===========

spruce is a Node.js a configurable logging library. it prints pretty colors to the console, and allows you to define custom logging handlers, so you can do something like this:

    var spruce = require('spruce').init({ 'methods' :{ 
                            'error' : {'handlers' :
                                         { 'email' : email_developers },
                                      'lineNum' : true,
                                        }
                            }
                    }); 
    spruce.error('My eyes! The goggles do nothing!');

and then all of your developers will get an email whenever an error happens.

Usage
-----
Download and add to your code:

    var spruce = require('spruce').init(options);

Options 
-------
Here are the default options:

var defaultOptions = {
            
            'dateFormat' : '[%m-%d-%y %H:%M:%S.%l]',
            'methods' : {
                'info' : {'lineNum' : false,
                            'color' : 30,
                            'handlers': {}},
                'trace' : {'lineNum' : true,
                            'color' : 30,
                            'handlers': {}},
                'debug' : {'lineNum' : true,
                            'color' : 34,
                            'handlers' : {}},
                'warn' : {'lineNum' : true,
                         'color' : 35,
                        'handlers' :{}},
                'error': {'lineNum' : true,
                          'color' :  31,
                          'handlers' : {}},
                },
            'moduleName' : null,
            'useColor' : false,
};

'dateFormat' is the string used to specify how the date should appear.

'moduleName' is used to print the name of the module where the error occured.
if moduleName is null, only the file and line where the error occurred is stored.

'methods' is a list of log methods to be constructed. Each method has the following options:

Method Options
----- 
'color': what color to display this text in, if useColor is enabled.

'lineNum': whether to compute a stack trace to get the line number.

'handlers': a dictionary of key - > function (msg). each function is called with the given message whenever that log method is called.


Samples 
-------

Just the default settings:
    [4-18-2011 17:57:48.220] INFO   - this is a info
    [4-18-2011 17:57:48.220] TRACE [tests.js:15:38] - this is a trace
    [4-18-2011 17:57:48.220] DEBUG [tests.js:15:38] - this is a debug
    [4-18-2011 17:57:48.220] WARN  [tests.js:15:38] - this is a warn
    [4-18-2011 17:57:48.220] ERROR [tests.js:15:38] - this is a error

-------
Released under MIT License. Enjoy and Fork!
