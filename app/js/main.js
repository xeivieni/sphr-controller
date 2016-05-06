/**
 * Created by clem on 04/05/2016.
 */

var Connector = require('./js/connector');
var LeapControl = require('./js/leap');
var Room = require('./js/room');
var Keys = require('./js/keys');


var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var waiter;

var config = require('./etc/config.json');

var wifiConfig = config['wifi'];

var messages = config['messages'];

var initInterface = function(){
    instructions.style.display = 'none';
    Room.init();
    document.body.removeEventListener('click', initInterface, false);
    window.addEventListener('resize', Room.onWindowResize, false);
    document.addEventListener('keydown', Keys.onKeyDown, false);
    document.addEventListener('keyup', Keys.onKeyUp, false);
    Room.render();
};


var appendLeapMessage = function(message){
    var oldMessage = document.getElementById("leapMessage");
    if (oldMessage !== null){
        document.body.removeChild(oldMessage);
    }
    var leapMessage = createClass("p", "leapMessage", "f", '', message);
    document.body.appendChild(leapMessage);
};

var appendWelcome = function(){
    var container3 = createClass("div", "container3", "container container", 3, '');
    var message2 = createClass("h1", "message2", "msg", '', '');
    for (var k = 0; k< messages["title"].length; k++){
        message2.appendChild(createClass("span", "span-color"+(k+2), "color", k+2, messages["title"][k]));
    }
    container3.appendChild(message2);
    var globalContainer = document.getElementById("global");
    globalContainer.appendChild(container3);
    document.body.addEventListener('click', initInterface, false);
};

var updateMessage = function(messageId){
    var text = document.getElementById("message1");
    var textContainer = document.getElementById("container2");
    var circlesContainer = document.getElementById("container1");
    textContainer.removeChild(text);
    var message = createClass("p", "message1", "msg", '', '');
    for (var i = 0; i < messages[messageId].length; i++){
        message.appendChild(createClass("span", "span-color"+(i+1), "color", i+1, messages[messageId][i]));
    }
    if (messageId === "success"){
        textContainer.style.animationName = "fadeOutDown";
        textContainer.style.animationDuration = "10s";
        textContainer.style.animationFillMode = "forwards";
        circlesContainer.style.animationName = "fadeOutUp";
        circlesContainer.style.animationDuration = "10s";
        circlesContainer.style.animationFillMode = "forwards";
        appendWelcome();
    }
    textContainer.appendChild(message);
};


var createClass = function (elementType, id, className, i, innerHtml) {
    var newClass = document.createElement(elementType);
    newClass.id = id;
    newClass.className = className + i;
    newClass.innerHTML = innerHtml;
    return newClass;
};

var createLoader = function (status) {
    var global = createClass("div", "global", '', '', '');
    var container = createClass("div", "container1", "container container", 1, '');
    var i;
    for (i = 1; i < 4; i++) {
        container.appendChild(createClass("div", ("circle"+i), "circle circle", i, ''));
    }
    var container2 = createClass("div", "container2", "container container", 2, '');
    var message = createClass("p", "message1", "msg", '', '');
    for (var j = 0; j< messages[status].length; j++){
        message.appendChild(createClass("span", "span-color"+(j+1), "color", j+1, messages[status][j]));
    }
    if (status === "success"){
        container2.style.animationName = "fadeOutDown";
        container2.style.animationDuration = "10s";
        container2.style.animationFillMode = "forwards";
        container.style.animationName = "fadeOutUp";
        container.style.animationDuration = "10s";
        container.style.animationFillMode = "forwards";
        appendWelcome();
    }
    container2.appendChild(message);
    global.appendChild(container);
    global.appendChild(container2);
    return global;
};

var connectToWifi = function(response){
    if (response['success'] === true){
        updateMessage("success");
    }
};


var readWifiList = function (response) {
    var i, found = false;
    for (i in response['networks']) {
        if (response['networks'][i]['ssid'] === wifiConfig['ssid']) {
            found = true;
            updateMessage("connection");
            Connector.connect(wifiConfig, connectToWifi);
        }
    }
    if (found === false){
        updateMessage("error");
    }
};

var readWifiName = function(response){
    if (response['ssid'] === wifiConfig['ssid'] && response['connection'] === 'connected') {
        updateMessage("success");
    }
    else {
        updateMessage("scan");
        Connector.scan(readWifiList);
    }
};

var load = function () {
    waiter = createLoader("check");
    instructions.appendChild(waiter);
    appendLeapMessage("No leap motion detected yet, use arrow keys to move the ball or connect one");
    Connector.getWifi(readWifiName);
};

var i = 0;
var control = function(frame){
    if (frame.hands.length > 1){
        i = i + 1;
        hand = frame.hands[0];
        if (i == 50){
            console.log("sending folowing form : x = " + hand.rotationAxis(frame)[0] + " y = " + hand.rotationAxis(frame)[1] + " z = " + hand.rotationAxis(frame)[2])
            i = 0;
            var formule = { x_pos: hand.rotationAxis(frame)[0], y_pos: hand.rotationAxis(frame)[1], z_pos: hand.rotationAxis(frame)[2] };
            Room.move_sphere(hand.rotationAxis(frame)[0], hand.rotationAxis(frame)[1]);
            //var request = require("request");

            //var options = { method: 'POST',
            //    url: 'http://163.173.96.154:8080/api/directions',
            //    headers:
            //    { 'content-type': 'application/x-www-form-urlencoded',
            //        'postman-token': 'efccd8d7-385a-0e54-2f99-4daf484a612b',
            //        'cache-control': 'no-cache' },
            //    form: formule };
            //
            //request(options, function (error, response, body) {
            //    if (error) throw new Error(error);
            //
            //    console.log(body);
            //});
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
    appendLeapMessage("Leap motion ready, use gestures to move the ball around");
    switchControls("leap");

}
function onDeviceDisconnected(evt)
{
    appendLeapMessage("Leap motion disconnected, use arrow keys to move the ball around");
    switchControls("keys");
}
