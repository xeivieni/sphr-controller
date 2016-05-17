/**
 * Created by clem on 04/05/2016.
 */

var Leap = require('leapjs');
var Room = require('./room');
var config = require('../etc/config.json');

var options = config['leap'];

var LeapControl = (function () {
    var self = {};
    self.i = 0;

    self.controller = new Leap.Controller(options);
    self.controller.connect();

    self.controller.on('frame', function(frame){
        if (frame.hands.length > 1){
            var type0 = frame.hands[0].type;
            var type1 = frame.hands[1].type;
            var rightHand = frame.hands[0];
            if (type0 == "right"){
                rightHand = frame.hands[0];
            }
            else if (type1 == "right"){
                rightHand = frame.hands[1];
            }
            var previousFrame = self.controller.frame(1);
            self.i = self.i + 1;
            if (self.i === 5){
                console.log("sending folowing form : x = " + rightHand.rotationAxis(previousFrame)[0] + " y = " + rightHand.rotationAxis(previousFrame)[1] + " z = " + rightHand.rotationAxis(previousFrame)[2])
                self.i = 0;
                Room.move_sphere(-rightHand.rotationAxis(previousFrame)[0], rightHand.rotationAxis(previousFrame)[1]);
            }
        }
    });

    return self;
})();

module.exports = LeapControl;