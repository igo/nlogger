/*
    spruce : a node logging library
    Copyright (c) 2011 by Mark P Neyer, Uber Technologies
     
    based upon:
        node-logger library
        http://github.com/igo/node-logger
    
        Copyright (c) 2010 by Igor Urmincek

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

var sys = require('sys');
var getDate = require('./date_utils').getDate;

function getLine(module) {
    //make an error to get the line number
    var e = new Error();
    var line = e.stack.split('\n')[4].split(':')[1];
    return line;
}

function getClass(module) {
    if (module) {
        if (module.id) {
            if (module.id == '.') {
                return 'main';
            } else {
                return module.id;
            }
        } else {
            return module;
        }
    } else {
        return '<unknown>';
    }
}

function getMessage(msg) {
    if (typeof msg == 'string') {
        return msg;
    } else {
        return sys.inspect(msg, false, 10);
    }
}

var defaultOptions = {
            'dateFormat' : '[%m-%d-%y %H:%M:%S.%l]',
            'useColor' : true,
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
};

function applyDefaults(given, defaults){
    var res = {};

    //go through all the default values for this option
    //and make sure those are all populated
    for (var dude in defaults){
        if (typeof given[dude] === 'undefined'){
            res[dude] = defaults[dude];
        } else if (typeof defaults[dude] in {'function': true,
                                              'boolean' : true,
                                              'number' : true,
                                               'string' : true}
                                                 ){
            res[dude] = given[dude]; 
        } else {
            res[dude] = applyDefaults(given[dude],
                                    defaults[dude]);
        }
    }
    //now add in the extra stuff that they supplied
    for (var dude in given){
        if (!(dude in defaults)){
            res[dude] = given[dude];
        }
    }

    //now apply all the nondefaults
    return res;
}
function init (module, opts) {
    //apply our defaults to the options
    //using the handy applyDefaults above
    //kaPOW
    if (typeof opts === 'undefined')
        opts = defaultOptions;
    else
        opts = applyDefaults(opts, defaultOptions); 
    //console.log(opts);
    //this is the object we return
    //it will only contain functions
    var logger = {};

    var defineMethod = function(level) {
        var levelStr = level.toUpperCase();
        if (levelStr.length == 4) levelStr += ' ';
        var color = opts.methods[level].color;


        var lineStr = '';
        if (opts.methods[level].lineNum){
            lineStr = '['+getClass(module) + ':'+ getLine(module)+']';
        }

        var getStringContent = function(msg){
            return  getDate(opts.dateFormat) + ' ' + levelStr + ' '+ 
                lineStr + ' - ' + getMessage(msg)
        }
        
        var handlers = opts.methods[level].handlers;
        var runHandlers = function(msg){
            for (var handlerName in handlers){
                handlers[handlerName](msg);
            }
        }
        if (opts.useColor && color) {
            logger[level] = function(msg) {
                sys.puts('\x1B[' + color +
                         'm' + getStringContent(msg) +  '\x1B[0m');
                runHandlers(msg); 
            };
        } else {
            logger[level] = function(msg) {
                sys.puts(getStringContent(msg));
                runHandlers(msg);
            };
        }
    }
    
    for (var level in opts.methods) {
            defineMethod(level);
    }
    return logger;
}

exports.logger = function (module, useColor) { 
    return init(module, defaultOptions); 
};
exports.init = init;
