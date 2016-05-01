/**
 * Created by clem on 01/05/2016.
 */

/* =======================================
 *              KEY EVENTS
 * =======================================
*/

var onKeyDown = function (event) {
    if (controlsEnabled == true) {
        switch (event.keyCode) {
            case 38: // up
                move_sphere(-1, 0);
                break;
            case 37: // left
                move_sphere(0, -1);
                break;
            case 37 && 38:
                move_sphere(-1, -1);
                break;
            case 39 && 38:
                move_sphere(-1, 1);
                break;
            case 40: // down
                move_sphere(1, 0);
                break;
            case 37 && 40:
                move_sphere(1, -1);
                break;
            case 39 && 40:
                move_sphere(1, 1);
                break;
            case 39: // right
                move_sphere(0, 1);
                break;
        }
    }
};
var onKeyUp = function (event) {
    if (controlsEnabled == true) {
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
    }
};