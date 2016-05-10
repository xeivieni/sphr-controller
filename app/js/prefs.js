/**
 * Created by clem on 06/05/2016.
 */

var ipc = require("electron").ipcRenderer;
var saveButton = document.getElementById("save-btn");
var cancelButton = document.getElementById("cancel-btn");
var defaultButton = document.getElementById("default-btn");

var jsonfile = require('jsonfile');
var actualConfig = require("./etc/config.json");

var file = __dirname + "/etc/config.json";

var fs = require('fs');

function copyDefaultConfig(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

var handleCopyError = function(x){
    if(typeof x === 'undefined') {
        var r = confirm('Configuration successfully updated\nClick Ok to quit the app');
        if (r == true) {
            ipc.send('quit-app');
        } else {
            alert('The configuration modifications will not be taken into account until restart');
        }
    } else {
        alert('An error occurred');
    }
};

saveButton.addEventListener('click', function () {
    //var objects = document.getElementsByClassName("panel-body");
    var objects = document.getElementsByClassName("input-group");
    var newConfig = {};

    for (var o in objects){
        try {
            var key = objects[o]["childNodes"][0]["textContent"];
            newConfig[key] = objects[o]["childNodes"][1]["value"];
        }
        catch (error){
            console.log(error);
        }
    }
    console.log(newConfig);
    for (var configKey in newConfig){
        for (var category in actualConfig){
            if ((actualConfig[category].hasOwnProperty(configKey)) && (newConfig[configKey] !== '')){
                console.log("found something to change at");
                console.log(actualConfig[category][configKey]);
                console.log("new value is ");
                console.log(newConfig[configKey]);
                actualConfig[category][configKey] = newConfig[configKey];
            }
        }
    }
    console.log(actualConfig);

    jsonfile.writeFile(file, actualConfig, function (err) {
        if (err === null){
            ipc.send('toogle-settings');
            var r = confirm('Configuration successfully updated\nClick Ok to quit the app');
            if (r == true) {
                ipc.send('quit-app');
            } else {
                alert('The configuration modifications will not be taken into account until restart');
            }
        } else {
            console.error(err);
        }
    });
});
cancelButton.addEventListener('click', function () {
    ipc.send('toogle-settings');
});
defaultButton.addEventListener('click', function () {
    ipc.send('toogle-settings');
    copyDefaultConfig(__dirname + "/etc/default_config.json", __dirname + "/etc/config.json", handleCopyError);
});
