/**
 * Created by clem on 06/05/2016.
 */

var ipc = require("electron").ipcRenderer;
var saveButton = document.getElementById("save-btn");
var cancelButton = document.getElementById("cancel-btn");
var defaultButton = document.getElementById("default-btn");

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
        console.log("reload the page");
    } else {
        console.log("error...");
    }
    //TODO
};

saveButton.addEventListener('click', function () {
    ipc.send('toogle-settings');
    var objects = document.getElementsByClassName("panel-body");
    //var object = objects.getElementsByClassName("input-group");
    //var input = object.getElementsByClassName("form-control");
    //console.log(input);
    //var inputGroups = [];
    //var forms = Array;
    for (var object in objects){
        try {
            var inputGroups = objects[object].getElementsByClassName("input-group");
        }
        catch(err) {
            //console.log(err);
        }
        for (var i=0; i<inputGroups.length; i++){
            console.log(inputGroups[i].getElementsByClassName("form-control")[0]["value"]);
            //var forms = (inputGroups[i].getElementsByClassName("form-control"));
            //for (var form in forms){
            //    console.log(forms[form]);
            //}

        }
    }
    //console.log(forms);

    ////for (var panelBody in objects){
    ////    for (var childNodes in objects[panelBody]['childNodes']){
    ////        console.log(objects[panelBody]['childNodes'][childNodes]);
    ////    }
    ////}
    //for (var childNodes in objects){
    //    if (objects.hasOwnProperty(childNodes)){
    //        for (var elements in childNodes){
    //            if (childNodes.hasOwnProperty(elements)){
    //                for (var subelements in elements){
    //                    console.log(objects[childNodes][elements][subelements]);
    //                }
    //            }
    //        }
    //    }
    //}
});
cancelButton.addEventListener('click', function () {
    ipc.send('toogle-settings');
});
defaultButton.addEventListener('click', function () {
    ipc.send('toogle-settings');
    copyDefaultConfig(__dirname + "/etc/default_config.json", __dirname + "/etc/config.json", handleCopyError);
});
