Spruce
===========

Spruce is a configurable node.js logging library. Its coolest feature is the ability to use custom logging handlers, so you can do something like this:

     var emailDevelopers = function(message){
            sendMail( {'from' : 'error@mcbain.com',
                        'to' : 'devs@mcbain.com',
                        'subject' : 'error: '+message,
                        'body' : makeMessageBody(message)});
            //do some hackery here
        };
     var options = { 'methods' :
                        { 'error' : 
                            { 'handlers' :  [ emailDevelopers ]},
                        }
                    }; 

    var spruce = require('spruce').init(options);
    spruce.error('My eyes! The goggles do nothing!');

and then all of your developers will get an email from McBain deploring the quality of his optical protection. 

Usage
-----
Download and add to your code (npm coming soon!):

    var spruce = require('spruce').init();

The variable 'spruce' will now be be an object with several functions: 

    { 'info' : [Function],
      'trace' : [Function],
      'debug' : [Function],
      'warn' : [Function],
      'error' : [Function]}

 Each of these functions takes a single argument, the message, and logs it and some other cool stuff to the console. For example, this code:

    spruce.info('Yes! we have no bonanza!')

produces this output:

    [4-19-2011 9:48:15.515] INFO  [readme.js:3:8] - Yes! we have no bonanaza!
Options 
-------
Everybody loves options! Spruce is highly configurable, so you can do a lot of neat stuff with it.  Here are the features it supports:

 - colored console printing.
 - custom date formatting.
 - custom log levels.
 - print module name and line number of log message.
 - handler functions for any log level.
 - will not pee on the floor or complain about your taste in clothes.

Here are the default options:

    var defaultOptions = {
            'dateFormat' : '[%m-%d-%y %H:%M:%S.%l]',
            'methods' : {
                'info' : {'lineNum' : false,
                            'color' : 30,
                            'handlers': []},
                'trace' : {'lineNum' : true,
                            'color' : 30,
                            'handlers': []},
                'debug' : {'lineNum' : true,
                            'color' : 34,
                            'handlers' : []},
                'warn' : {'lineNum' : true,
                         'color' : 35,
                        'handlers' : []},
                'error': {'lineNum' : true,
                          'color' :  31,
                          'handlers' : []},
                },
            'moduleName' : null,
            'useColor' : false,
    };


`dateFormat` is the string used to specify how the date should appear. it uses standard strftime
options, although I did not implement day of the year (%j) or week of the year (%u).  

`methods` is a config object for each of the  log methods you want to have in your logging system. The options for each of these objects are explained below.

By default, every logger returned will have have `info`, `trace`, `debug`, `info`, `warn`, and `error` methods. You are free to add as many as you would like. 

`moduleName` is used to print the name of the module where the log message occured. if `moduleName` is null, only the file and line where the error occurred is printed. Note that `moduleName`  only takes effect for methods that have the `lineNum` option enabled. To use this effectively, you will need to specify the module you're in every time you require the spruce module.

`useColor` determines whether to use awesome colors or boring plain text.

Method Options
----- 
`color`: what color to display this text in, if `useColor` is enabled.

`lineNum`: whether to compute a stack trace to get the line number. This is disabled for the `info` level be default, for performance reasons.

`handlers`: a list of single-argument functions to be called with the log message whenever that log method is called.  Using `handlers` you can do things like:

- Email all developers whenever an error occurs
- Dump all log messages matching a regex into a database
- Find log messages encoding turing machines that halt for every input and... well, maybe not.

Example
------
    var move = function(zig) { //for great justice! }; 
    var opts = {'methods' : {'operator': { 'handlers' : [move]}}}; 
    var spruce = require('spruce').init(opts);

    if (somebodySetUpUsTheBomb())
        spruce.operator('Main Screen Turn on!')

... and then operator will move the zig when the bomb is set up. 
 
License
-------
MIT License. Enjoy and Fork!

Credits
--------
Based upon node-logger by igo. 
