/*
  nlogger library (formerly node-logger)
  http://github.com/igo/nlogger
  
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

var util = require('util'),
    fs = require('fs');


function padZero(number) {
  var n = String(number);
  if (number < 10) {
    return '0' + n;
  } else {
    return n;
  }
}

function pad2Zeros(number) {
  var n = String(number);
  if (number < 10) {
    return '00' + n;
  } else if (number < 100) {
    return '0' + n;
  } else {
    return n;
  }
}

function getDate() {
  var now = new Date();
  return now.getFullYear() + '-' + padZero(now.getMonth() + 1) + '-' + padZero(now.getDate()) + ' ' +
    padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds()) + '.' + pad2Zeros(now.getMilliseconds());
}

function getLine() {
  try {
    throw new Error();
  } catch(e) {
    // now magic will happen: get line number from callstack
    var line = e.stack.split('\n')[3].split(':')[1];
    return line;
  }
}

function getClass(module) {
  if (module) {
    if (module.id) {
      if (module.id == '.') {
        return 'main';
      } else {
        return module.id.replace(process.env.PWD, "").replace(/.js$/, "").replace(/^\//, "");
      }
    } else {
      return module;
    }
  } else {
    return '<unknown>';
  }
}

function getMessage(msg, params) {
  var i;
  if (typeof msg == 'string') {
    // insert params
    msg = msg.split('{}');
    for (i = 0; i < params.length; i++) {
      msg.splice(2 * i + 1, 0, util.inspect(params[i], false, 10));
    }
    return msg.join(' ');
  } else {
    return util.inspect(msg, false, 10);
  }
}

try {
  var file = fs.readFileSync('./nlogger.json', 'binary'),
    config = JSON.parse(file);
} catch(e) {
  util.puts(getDate() + ' WARN  nlogger - Error loading nlogger config file. Using defaults');
  config = {};
}

var defaultMethods = {
  'test':  { 'color': 33, 'priority': 1 },
  'trace': { 'color': 32, 'priority': 2 },
  'debug': { 'color': 34, 'priority': 3 },
  'info':  { 'color': 30, 'priority': 4 },
  'warn':  { 'color': 35, 'priority': 5 },
  'error': { 'color': 31, 'priority': 6 }
};

var methodNames = [];
if (config.methods) {
  var k, v, priority, color, methodVal, i;
  var methodNames = [];
  var priorities = [];
  
  var colorMap = {
    grey:    "0;30",
    red:     "0;31",
    green:   "0;32",
    yellow:  "0;33",
    blue:    "0;34",
    magenta: "0;35",
    cyan:    "0;36",
    white:   "0;37",
    boldGrey:    "1;30",
    boldRed:     "1;31",
    boldGreen:   "1;32",
    boldYellow:  "1;33",
    boldBlue:    "1;34",
    boldMagenta: "1;35",
    boldCyan:    "1;36",
    boldWhite:   "1;37"
  };
  
  map_color = function(c) {
    cNew = colorMap[c];
    return cNew ? cNew : c;
  }
  
  bad_method = function(msg) {
    util.puts(getDate() + ' WARN  nlogger - ' + msg + '  Using default methods')
    config.methods = defaultMethods;
  }
  
  for (method in config.methods) {
    
    if (methodNames.indexOf(method) >= 0) {
      bad_method('There are two methods (' + method + ') with the same key')
      break;
    }
    methodNames.push(method);
    
    methodVal = config.methods[method];
    priority = methodVal.priority;
    if (priority == null) {
      bad_method('Method: ' + method + ' needs to have the priority field');
      break;
    }
    if (priorities.indexOf(priority) >= 0) {
      bad_method('Method: ' + method + ' needs to have a unique priority');
      break;
    }
    priorities.push(priority);
    
    if (methodVal.color == null) {
      bad_method('Method: ' + method + ' needs to have the color field');
      break;
    }
    if (typeof methodVal.color === 'string') {
      methodVal.color = map_color(methodVal.color);
    }
  }
  
  for (k in config.levels) {
    level = config.levels[k];
    if (methodNames.indexOf(level) == -1) {
      bad_method('Level: ' + k + ' needs be a value in [' = methodNames.join(', ') = ']');
      break;
    }
  }
  
} else {
  config.methods = defaultMethods;
}

var maxMethodNameSize = 0;
for (methodName in config.methods) {
  maxMethodNameSize = methodName.length > maxMethodNameSize ? methodName.length : maxMethodNameSize;
}


var defaultLogLevel = config.level && config.level['*'] || 'trace';
var logLevels = config.level || {};
var useColor = (config.color == true ) || (config.color == 'auto' && process.env.TERM && process.env.TERM.indexOf('color') >= 0);


exports.logger = function(module) {
  var methods = config.methods;

  var modClass = getClass(module);
  var logLevel = logLevels[modClass] || defaultLogLevel;
  var priority = methods[logLevel].priority;

  var logger = {
    levelKey: modClass,
    isTest:   (logLevel == "test"),
    level:    logLevel,
    priority: priority
  };

  var defineMethod = function(level) {
    var levelStr = level.toUpperCase();
    while (levelStr.length < maxMethodNameSize) levelStr += ' ';
    if (useColor) {
      logger[level] = function(msg) {
        var params;
        if (methods[level].priority >= priority) {
          params = Array.prototype.slice.call(arguments, 1);
          util.puts('\x1B[' + methods[level].color + 'm' + getDate() + ' ' + levelStr + ' ' + modClass +':' + getLine() + ' - ' + getMessage(msg, params) + '\x1B[0m');
        }
      };
    } else {
      logger[level] = function(msg) {
        var params;
        if (methods[level].priority >= priority) {
          params = Array.prototype.slice.call(arguments, 1);
          util.puts(getDate() + ' ' + levelStr + ' ' + modClass +':' + getLine() + ' - ' + getMessage(msg, params));
        }
      };
    }
  }
  
  for (var level in methods) {
    defineMethod(level);
  }

  return logger;
}
