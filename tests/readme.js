var spruce = require('../lib/spruce').init();
var sys = require('sys');
spruce.info('Yes! we have no bonanaza!');

    var sendMail = function (msg){
        console.log('Sending '+sys.inspect(msg,true));
    };
    var makeMessageBody = function(message){
        return 'what ' + message;
    }
    var emailDevelopers = function(message){
            sendMail( {'from' : 'ohsnap@fake.org',
                        'to' : 'devs@fake.org',
                        'subject' : 'error: '+message,
                        'body' : makeMessageBody(message)});
            //do some hackery here
        };
     var options = { 'methods' :
                        { 'error' : 
                            { 'handlers' :  [ emailDevelopers ]},
                        }
                    }; 

    var spruce = require('../lib/spruce').init(options);
    spruce.error('My eyes! The goggles do nothing!');

