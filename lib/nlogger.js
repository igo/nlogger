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

var sys = require('sys'),
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
				return module.id;
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
			msg.splice(2 * i + 1, 0, sys.inspect(params[i], false, 10));
		}
		return msg.join('');
	} else {
		return sys.inspect(msg, false, 10);
	}
}

try {
	var file = fs.readFileSync('./nlogger.json', 'binary'),
		config = JSON.parse(file);
} catch(e) {
	sys.puts(getDate() + ' WARN  nlogger - Error loading nlogger config file. Using defaults');
	config = {};
}

var defaultLogLevel = config.level && config.level['*'] || 'trace';
var logLevels = config.level || {};
var useColor = config.color || (config.color == 'auto' && process.env.TERM && process.env.TERM.indexOf('color') >= 0);

exports.logger = function(module) {
	var methods = {
		'trace': { 'color': 32, 'priority': 1 },
		'debug': { 'color': 34, 'priority': 2 },
		'info':  { 'color': 30, 'priority': 3 },
		'warn':  { 'color': 35, 'priority': 4 },
		'error': { 'color': 31, 'priority': 5 }
	};

	var logLevel = logLevels[getClass(module)] || defaultLogLevel;
	var priority = methods[logLevel].priority;

	var logger = {};

	var defineMethod = function(level) {
		var levelStr = level.toUpperCase();
		if (levelStr.length == 4) levelStr += ' ';
		if (useColor) {
			logger[level] = function(msg) {
				var params;
				if (methods[level].priority >= priority) {
					params = Array.prototype.slice.call(arguments, 1);
					sys.puts('\x1B[' + methods[level].color + 'm' + getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine() + ' - ' + getMessage(msg, params) + '\x1B[0m');
				}
			};
		} else {
			logger[level] = function(msg) {
				var params;
				if (methods[level].priority >= priority) {
					params = Array.prototype.slice.call(arguments, 1);
					sys.puts(getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine() + ' - ' + getMessage(msg, params));
				}
			};
		}
	}
	
	for (var level in methods) {
		defineMethod(level);
	}

	return logger;
}
