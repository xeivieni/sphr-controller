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
        //console.log(frame.currentFrameRate);
        if (frame.hands.length > 1){
            var type0 = frame.hands[0].type;
            var type1 = frame.hands[1].type;
            var rightHand = frame.hands[0];
            var leftHand = frame.hands[1];
            if (type0 == "right"){
                rightHand = frame.hands[0];
                leftHand = frame.hands[1];
            }
            else if (type1 == "right"){
                rightHand = frame.hands[1];
                leftHand = frame.hands[0];
            }
            var previousFrame = self.controller.frame(1);
            self.i = self.i + 1;
            var x = Number((-rightHand.rotationAxis(previousFrame)[0]).toFixed(1));
            var y = Number((rightHand.rotationAxis(previousFrame)[1]).toFixed(1));
            var z = Number((leftHand.rotationAxis(previousFrame)[2]).toFixed(1));

            if (x > 0.2) {
                x = 1;
            }
            else if (x < -0.2) {
                x = -1;
            }
            else {
                x = 0;
            }
            if (y > 0.8) {
                y = 1;
            }
            else if (y < -0.8) {
                y = -1;
            }
            else {
                y = 0;
            }
            if (z > 0.5) {
                z = 1;
            }
            else if (z < -0.5) {
                z = -1;
            }
            else {
                z = 0;
            }

            if (self.i === 20){
                self.i = 0;
                Room.move_sphere(x, y, 0);
                var old_x = x;
                var old_y = y;
                var old_z = z;
            }
        }
    });

    return self;
})();

module.exports = LeapControl;