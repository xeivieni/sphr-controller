/**
 * Created by clem on 04/05/2016.
 */

var Room = require('./room');

var Keys = (function () {
    var self = {};
    self.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up
                Room.move_sphere(-1, 0);
                break;
            case 37: // left
                Room.move_sphere(0, -1);
                break;
            case 37 && 38: // up & left
                Room.move_sphere(-1, -1);
                break;
            case 39 && 38: // up & right
                Room.move_sphere(-1, 1);
                break;
            case 40: // down
                Room.move_sphere(1, 0);
                break;
            case 37 && 40: // down & left
                Room.move_sphere(1, -1);
                break;
            case 39 && 40: // down & right
                Room.move_sphere(1, 1);
                break;
            case 39: // right
                Room.move_sphere(0, 1);
                break;
        }

    };

    self.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
                break;
            case 37: // left
                break;
            case 40: // down
                break;
            case 39: // right
                break;
        }
    };

    return self;
})();


module.exports = Keys;