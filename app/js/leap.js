/**
 * Created by clem on 04/05/2016.
 */

var Leap = require('leapjs');

var options = {enableGestures: true};

var LeapControl = (function () {
    var self = {};
    self.control = function(callback){
        self.leapControler = Leap.loop(options, callback);
    };
    return self;

})();

module.exports = LeapControl;