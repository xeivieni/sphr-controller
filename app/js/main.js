/**
 * Created by clem on 04/05/2016.
 */

var Connector = require('./js/connector');

var instructions = document.getElementById('instructions');

var mode = "arrows";

var endLoadAnimation = function (response) {
    if (response === true) {
        console.log('Yipikayé motherfucker');
        instructions.removeChild(waiter);
        var click = document.createElement("div");
        click.innerHTML = "<span style='font-size: 40px'>Click to play</span><br/>";
        var text;
        if (mode == "leap") {
            text = click.innerHTML + "Use leap motion to move the ball";
        } else if (mode == "arrows") {
            text = click.innerHTML + "Use arrows to move around";
        } else {
            text = click.innerHTML + "magical move";
        }
        click.innerHTML = text;
        click.addEventListener('click', function (event) {
            instructions.style.display = 'none';
            controlsEnabled = true;
        }, false);

        instructions.appendChild(click);
    } else {
        console.log('Branche ton Rpi maggle');
    }

};

var load = function () {
    console.log("not connected, supposed to have an animation");
    var waiter = createLoader("check");
    instructions.appendChild(waiter);
    Connector.connectRpi(x => {
        endLoadAnimation(x)
    });
};

load();

var createLoader = function (status) {
    var messages = {
        "check": ["reading wifi network", ''],
        "scan": ["looking for", "Pi_AP", "in the available wifi network list"],
        "connection": ["connecting to", "Pi_AP"],
        "success": ["connected"],
        "title": ["· Sphr", "Motion ·"]
    };
    var global = createClass("div", '', '', '');
    var container = createClass("div", "container container", 1, '');
    var i;
    for (i = 1; i < 4; i++) {
        container.appendChild(createClass("div", "circle circle1", i + 1, ''));
    }
    var container2 = createClass("div", "container container", 2, '');
    var message = createClass("p", "msg", '', '');
    for (var j = 0; j< messages[status].length; j++){
        message.appendChild(createClass("span", "color", j+1, messages[status][j]));
    }
    container2.appendChild(message);
    var container3 = createClass("div", "container container", 3, '');
    var message2 = createClass("h1", "msg", '', '');
    for (var k = 0; k< messages["title"].length; j++){
        message2.appendChild(createClass("span", "color", j+2, messages["title"][j]));
    }
    container3.appendChild(message2);
    global.appendChild(container);
    global.appendChild(container2);
    global.appendChild(container3);
    return global
};


var createClass = function (elementType, className, i, innerHtml) {
    var newClass = document.createElement(elementType);
    newClass.className = className + i;
    newClass.innerHTML = innerHtml;
    return newClass;
};

//<div class="container container1">
//    <div class="circle circle1"></div>
//    <div class="circle circle2"></div>
//    <div class="circle circle3"></div>
//    </div>
//    <div class="container container2">
//    <p class="msg">
//    <span class="color1">#</span><span class="color2">Connecting to </span><span class="color3">Pi_AP</span>
//    </p>
//    </div>
//    <div class="container container3">
//    <h1 class="msg">
//    <span class="color2">· Sphr</span>
//<span class="color3">Motion ·</span>
//</h1>
//</div>