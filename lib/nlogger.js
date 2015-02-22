/*
	nlogger library (formerly node-logger)
	http://github.com/igo/nlogger
	
	Copyright (c) 2010-2015 by Igor Urmincek

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
	fs = require('fs'),
	path = require('path');


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
	var e = new Error();
	// now magic will happen: get line number from callstack
	var line = e.stack.split('\n')[3].split(':')[1];
	return line;
}

function getClass(module) {
	if (module) {
		if (module.id) {
			if (module.id == '.') {
				return 'main';
			} else {
				if (fs.existsSync(module.id)) { // module.id is file path
					return path.relative(path.dirname(require.main.filename), path.dirname(module.id)) + path.sep + path.basename(module.id, '.js');
				}
				return module.id;
			}
		} else {
			return module;
		}
	} else {
		return '<unknown>';
	}
}

function getMessage(items) {
	var msg = [], i;
	for (i = 0; i < items.length; i++) {
		if (typeof items[i] == 'string') {
			msg.push(items[i]);
		} else {
			msg.push(util.inspect(items[i], false, 10));
		}
	}
	return msg.join('');
}

try {
	var file = fs.readFileSync('./nlogger.json', 'binary'),
		config = JSON.parse(file);
} catch(e) {
	console.log(getDate() + ' WARN  nlogger - Config file not found. Using default configuration.');
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
				if (methods[level].priority >= priority) {
					console.log('\x1B[' + methods[level].color + 'm' + getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine() + ' - ' + getMessage(arguments) + '\x1B[0m');
				}
			};
		} else {
			logger[level] = function(msg) {
				if (methods[level].priority >= priority) {
					console.log(getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine() + ' - ' + getMessage(arguments));
				}
			};
		}
	}
	
	for (var level in methods) {
		defineMethod(level);
	}

	return logger;
}
