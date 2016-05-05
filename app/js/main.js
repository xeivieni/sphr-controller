/**
 * Created by clem on 04/05/2016.
 */

var Connector = require('./js/connector');
var LeapControl = require('./js/leap');
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var waiter;

var config = {
    ssid: 'Pi_AP',
    password: 'raspberry'
};

var messages = {
    "check": ["#", "reading wifi network", ''],
    "scan": ["#", "looking for ", "Pi_AP ", "in the available wifi network list"],
    "connection": ["#", "connecting to ", "Pi_AP"],
    "success": ["#", "connected"],
    "error": ["#", "0 ", "robot found"],
    "title": ["- Sphr ", "Motion -"]
};

var mode = "arrows";

var appendWelcome = function(){
    var container3 = createClass("div", "container3", "container container", 3, '');
    var message2 = createClass("h1", "message2", "msg", '', '');
    for (var k = 0; k< messages["title"].length; k++){
        message2.appendChild(createClass("span", "span-color"+(k+2), "color", k+2, messages["title"][k]));
    }
    container3.appendChild(message2);
    var globalContainer = document.getElementById("global");
    globalContainer.appendChild(container3);
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
        if (response['networks'][i]['ssid'] === 'Pi_AP') {
            found = true;
            updateMessage("connection");
            Connector.connect(config, connectToWifi);
        }
    }
    if (found === false){
        updateMessage("error");
    }
};

var readWifiName = function(response){
    if (response['ssid'] === 'Pi_AP' && response['connection'] === 'connected') {
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
    Connector.getWifi(readWifiName);
};


var control = function(leapController){
    console.log(leapController);
};

load();
LeapControl.control(control);

if (LeapControl.leapControler.connected() === true){
    console.log("Leap motion connected, use gestures to move the ball around");
} else {
    console.log("Leap motion not detected, use arrows to control the ball");
}