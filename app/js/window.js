/**
 * Created by clem on 17/05/2016.
 */
/**
 * Created by clem on 04/05/2016.
 */
var Room = require('./room');
var Keys = require('./keys');

var Window = (function () {
    var self = {};
    var instructions = document.getElementById('instructions');
    var messages = require('../etc/config.json')['messages'];


    self.initInterface = function(){
        instructions.style.display = 'none';
        Room.init();
        document.body.removeEventListener('click', self.initInterface, false);
        window.addEventListener('resize', Room.onWindowResize, false);
        document.addEventListener('keydown', Keys.onKeyDown, false);
        document.addEventListener('keyup', Keys.onKeyUp, false);
        Room.render();
    };


    self.appendLeapMessage = function(message){
        var oldMessage = document.getElementById("leapMessage");
        if (oldMessage !== null){
            document.body.removeChild(oldMessage);
        }
        var leapMessage = self.createClass("p", "leapMessage", "f", '', message);
        document.body.appendChild(leapMessage);
    };


    self.appendRetry = function () {
        var container = self.createClass("div", "container4", "container container", 4, "");
        var button = self.createClass("button", "retryButton", "btn btn-2 btn-2g", '', "Retry");
        container.appendChild(button);
        instructions.appendChild(container);
    };


    self.appendWelcome = function(){
        var container3 = self.createClass("div", "container3", "container container", 3, '');
        var message2 = self.createClass("h1", "message2", "msg", '', '');
        for (var k = 0; k< messages["title"].length; k++){
            message2.appendChild(self.createClass("span", "span-color"+(k+2), "color", k+2, messages["title"][k]));
        }
        container3.appendChild(message2);
        var globalContainer = document.getElementById("global");
        globalContainer.appendChild(container3);
        document.body.addEventListener('click', self.initInterface, false);
    };


    self.updateMessage = function(messageId){
        var text = document.getElementById("message1");
        var textContainer = document.getElementById("container2");
        var circlesContainer = document.getElementById("container1");
        textContainer.removeChild(text);
        var message = self.createClass("p", "message1", "msg", '', '');
        for (var i = 0; i < messages[messageId].length; i++){
            message.appendChild(self.createClass("span", "span-color"+(i+1), "color", i+1, messages[messageId][i]));
        }
        if (messageId === "success"){
            textContainer.style.animationName = "fadeOutDown";
            textContainer.style.animationDuration = "10s";
            textContainer.style.animationFillMode = "forwards";
            circlesContainer.style.animationName = "fadeOutUp";
            circlesContainer.style.animationDuration = "10s";
            circlesContainer.style.animationFillMode = "forwards";
            self.appendWelcome();
        }
        textContainer.appendChild(message);
    };


    self.createClass = function (elementType, id, className, i, innerHtml) {
        var newClass = document.createElement(elementType);
        newClass.id = id;
        newClass.className = className + i;
        newClass.innerHTML = innerHtml;
        return newClass;
    };


    self.createLoader = function (status) {
        var global = self.createClass("div", "global", '', '', '');
        var container = self.createClass("div", "container1", "container container", 1, '');
        var i;
        for (i = 1; i < 4; i++) {
            container.appendChild(self.createClass("div", ("circle"+i), "circle circle", i, ''));
        }
        var container2 = self.createClass("div", "container2", "container container", 2, '');
        var message = self.createClass("p", "message1", "msg", '', '');
        for (var j = 0; j< messages[status].length; j++){
            message.appendChild(self.createClass("span", "span-color"+(j+1), "color", j+1, messages[status][j]));
        }
        if (status === "success"){
            container2.style.animationName = "fadeOutDown";
            container2.style.animationDuration = "10s";
            container2.style.animationFillMode = "forwards";
            container.style.animationName = "fadeOutUp";
            container.style.animationDuration = "10s";
            container.style.animationFillMode = "forwards";
            self.appendWelcome();
        }
        container2.appendChild(message);
        global.appendChild(container);
        global.appendChild(container2);
        return global;
    };

    return self;
})();


module.exports = Window;
