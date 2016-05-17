/**
 * Created by clem on 04/05/2016.
 */

var Connector = require('./js/connector');
var LeapControl = require('./js/leap');
var Room = require('./js/room');
var Keys = require('./js/keys');
var Window = require('./js/window');


var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var waiter;

var robotConfig = require('./etc/config.json')['robot'];


document.body.style.background = require('./etc/config.json')["display"]["background"];


var connectToWifi = function(response){
    if (response['success'] === true){
        Window.updateMessage("success");
    }
};


var readWifiList = function (response) {
    var i, found = false;
    for (i in response['networks']) {
        if (response['networks'][i]['ssid'] === robotConfig['ssid']) {
            found = true;
            Window.updateMessage("connection");
            Connector.connect(robotConfig, connectToWifi);
        }
    }
    if (found === false){
        Window.updateMessage("error");
        Window.appendRetry();
        var button = document.getElementById("retryButton");
        button.addEventListener('click', retry, false);
    }
};

var readWifiName = function(response){
    if (response['ssid'] === robotConfig['ssid'] && response['connection'] === 'connected') {
        Window.updateMessage("success");
    }
    else {
        Window.updateMessage("scan");
        Connector.scan(readWifiList);
    }
};

var load = function () {
    waiter = Window.createLoader("check");
    instructions.appendChild(waiter);
    Window.appendLeapMessage("No leap motion detected yet, use arrow keys to move the ball or connect one");
    Connector.getWifi(readWifiName);
};

var retry = function () {
    var waiter = document.getElementById("global");
    var buttonContainer = document.getElementById("container4");
    instructions.removeChild(waiter);
    instructions.removeChild(buttonContainer);
    load();
};

var i = 0;
var control = function(frame){
    if (frame.hands.length > 1){
        i = i + 1;
        hand = frame.hands[0];
        if (i == 50){
            console.log("sending folowing form : x = " + hand.rotationAxis(frame)[0] + " y = " + hand.rotationAxis(frame)[1] + " z = " + hand.rotationAxis(frame)[2])
            i = 0;
            Room.move_sphere(hand.rotationAxis(frame)[0], hand.rotationAxis(frame)[1]);

        }
    }
};

var switchControls = function(type){
    if (type === "leap"){
        console.log("switching controls to leap motion");
        document.removeEventListener('keydown', Keys.onKeyDown, false);
        document.removeEventListener('keyup', Keys.onKeyUp, false);
    } else {
        console.log("switching controls to keyboard");
        document.addEventListener('keydown', Keys.onKeyDown, false);
        document.addEventListener('keyup', Keys.onKeyUp, false);

    }
};

load();
LeapControl.control(control);

LeapControl.leapControler.on('streamingStarted', onDeviceReady);
LeapControl.leapControler.on('streamingStopped', onDeviceDisconnected);

function onDeviceReady(evt)
{
    Window.appendLeapMessage("Leap motion ready, use gestures to move the ball around");
    switchControls("leap");

}
function onDeviceDisconnected(evt)
{
    Window.appendLeapMessage("Leap motion disconnected, use arrow keys to move the ball around");
    switchControls("keys");
}


