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

var daysOfWeekShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var daysOfWeekLong = ['Sunday','Monday','Tuesday','Wednesday',
                     'Thursday','Friday','Saturday']; 
var monthsShort = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec' ];
var monthsLong = [ 'January', 'Feburary', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November','December'];

var dateFormatMap = {
    //if they did %%, we give 'em %
    '%' : function(d) { return '%'},
    //otherwise, give 'em the woiks
    
    'f' : function(d) { return d.getMilliseconds() * 1000;},
    'l' : function(d) { return d.getMilliseconds();},

    'S' : function(d) { return d.getSeconds();},

    'M' : function(d) { return d.getMinutes();},

    'H' : function(d) { return d.getHours();},
    'I' : function(d) { var h = d.getHours();
                         var nh = h % 12;
                         return nh == 0 ? 12 : nh; 
                        },
    'p' : function(d) {return d.getHours() > 11 ? 'PM' : 'AM';},

    'd' : function(d) { return d.getDate();},
    'w' : function(d) { return d.getDay();},
    'a' : function(d) { return daysOfWeekShort[d.getDay()];},
    'A' : function(d) { return daysOfWeekLong[d.getDay()];},
    'j' : function(d) { return d.getDate();},

    'm' : function(d) { return d.getMonth() +1;},
    'b' : function(d) { return monthsShort[d.getMonth()];},
    'B' : function(d) { return monthsLong[d.getMonth()];},

    'y' : function(d) { return d.getFullYear();}, 
    'Y' : function(d) { return d.getFullYear() % 100;}, 

    'z' : function(d) { var o = d.getTimezoneOffset();
                         var mins = o % 60;
                         var hrs = (o - mins)/60;
                         var res = padZero(hrs) +  padZero(o % 60)
                         if (o > -1)
                            return '+'+res;
                         return res;
                        },
    
};



function getDate(format) {
    var d = new Date(); 
    var res = '';
    var isFmt = false;
    var c = null;

    for (var i in format){
        c = format[i];
        if (isFmt){
            isFmt = false;
            res = res + dateFormatMap[c](d);
        }else if (c == '%'){
           isFmt = true; 
        }
        else
            res = res + c;
    }
    return res;
}

exports.getDate = getDate;
