Spruce
===========

Spruce is a configurable node.js logging library. it prints pretty colors to the console, and allows you to define custom logging handlers, so you can do something like this:

     var emailDevelopers = function(message){
            sendMail( {'from' : 'ohsnap@fake.org',
                        'to' : 'devs@fake.org',
                        'subject' : 'error: '+message,
                        'body' : makeMessageBody(message)});
            //do some hackery here
        };
     var options = { 'methods' :
                        { 'error' : 
                            { 'handlers' :  { 'email' : emailDevelopers },
                              'lineNum' : true},
                        }
                }; 

    var spruce = require('spruce').init(options);
    spruce.error('My eyes! The goggles do nothing!');

and then all of your developers will get an email whenever any error happens. Hooray!

Usage
-----
Download and add to your code:
    var spruce = require('spruce').init([options]);

The variable 'spruce' will now be be an object with several functions: info, trace, debug, warn, and error. each function takes a single argument, the message, and logs this to the console.

Options 
-------
Here are the default options; this is what you get if you do not specify any:

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

'dateFormat' is the string used to specify how the date should appear. it uses standard strftime
options, although I did not implement day of the year (%j) or week of the year (%u).  

'methods' is a list of log methods you want to have in your logging system. If you like, you can 
add other methods to this list, so that you could do something like

    if (someoneSetUpUsTheBomb())
        spruce.cats('Main Screen Turn on!')
 

'moduleName' is used to print the name of the module where the error occured.
if moduleName is null, only the file and line where the error occurred is stored.

'useColor' determines whether to use awesome colors in the terminal, or boring plain text.

Method Options
----- 
'color': what color to display this text in, if useColor is enabled.

'lineNum': whether to compute a stack trace to get the line number.

'handlers': a dictionary of key - > function (msg). each function is called with the given message whenever that log method is called.


-------
Released under MIT License. Enjoy and Fork!
