var logger = require('../lib/spruce.js').logger(module, true);


function testThemAll(){

    console.log ('\n---- testing all the functions ---- ');
    for (var level in logger){
        logger[level]('this is a '+level);
    }
    console.log ('---- done testing  ---- \n');
}

testThemAll();

function notADate(){
    return 'LOL @ U';
}
var opts = {'useColor' : false,
            'dateFormat' : '[%% %f %S %M %H %I '+
                            '%d %w %a %A %m %b %B %y %Y %z]'};

logger = require('../lib/spruce.js').init(module,
                                                opts); 

testThemAll();

var opts = {'useColor' : true,
            'dateFormat' : '[%A, %B %d %y, %I:%M:%S.%f %p]',
            'methods' : {'info' : { 'color' : 32}, 
                         'trace' : {'color' : 30},
                        'debug' : { 'color' : 33},
                        'info':  { 'color' : 34},
                        'warn' : { 'color' : 35},
                        'extra' : { 'color' : 42},
                        'sextra' : { 
                                     'lineNum' : true},
                        'error' : {'color' : 36,
                                    'handlers' : {
                                    'jimbob' : function (msg) {
                                            console.log ('Emailing about "'+msg+
                                            '"');
                                        }
                                    } 
                                },
                        }
            };

logger = require('../lib/spruce.js').init(module,
                                                opts); 
testThemAll();
