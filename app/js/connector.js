/**
 * Created by clem on 04/05/2016.
 */

/*
    // Wifi scan and connection if found
child = exec('osx-wifi-cli', function (error, stdout, stderr) {
    if (stdout !== null) {
        var name = stdout.slice(21);
        if (name.match(/Pi_AP/) == null) {
            console.log("Not connected to a robot, searching one near...");
            child = exec('osx-wifi-cli scan',
                function (error, stdout, stderr) {
                    if (stdout !== null) {
                        var scan = stdout;
                        if (scan.match(/Pi_AP/) == null) {
                            console.log("No robot found");
                            connectedToRobot = true;
                        }
                        else {
                            console.log("Robot found, connecting...");
                            child = exec('osx-wifi-cli Pi_AP raspberry',
                                function (error, stdout, stderr) {
                                    child = exec('osx-wifi-cli',
                                        function (error, stdout, stderr) {
                                            console.log("Connection succesful");
                                            connectedToRobot = true;
                                        });
                                });
                        }
                    } else if (stderr !== null) {
                        console.log('stderr: ' + stderr);
                    } else if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        }
        else {
            console.log("Connected to a robot ! ");
            connectedToRobot = true;
        }
    } else if (stderr !== null) {
        console.log('stderr: ' + stderr);
    } else if (error !== null) {
        console.log('exec error: ' + error);
    }
});*/

var exec = require('child_process').exec,
    child;
var wifi = require('wifi-control');

var settings = {
    debug : false,
    iface: 'wlan0',
    connectionTimeout: 10000
};

var Connector = (function () {
    var self = {};
    wifi.init(settings);

    self.connect = function(config, callback){
        wifi.connectToAP(config, function(err, response) {
            if (err) console.log(err);
            callback(response);
        });
    };

    self.scan = function(callback){
        wifi.scanForWiFi( function(err, response) {
            if (err) console.log(err);
            callback(response);
        });
    };

    self.getWifi = function(callback){
        callback(wifi.getIfaceState());
    };

    return self;
})();
//
//var Connector = (function () {
//    var self = {};
//
//    function isConnected(callback) {
//        console.log('Looking to see if the actual wifi name is Pi-AP');
//        child = exec('osx-wifi-cli', function (error, stdout) {
//            if (stdout !== null) {
//                var name = stdout.slice(21);
//                if (name.match(/Pi_AP/) == null) {
//                    console.log("No - Wifi network is not named Pi_AP.");
//                    callback(false);
//                } else {
//                    console.log("Yes - Wifi network is named Pi_AP ! :)");
//                    callback(true);
//                }
//            }
//        });
//    }
//
//    function searchRpi(callback) {
//        console.log('Searching for a wifi named Pi_AP in the available wifi list...');
//        child = exec('osx-wifi-cli scan', function (error, stdout) {
//            if (stdout !== null) {
//                if (stdout.match(/Pi_AP/) == null) {
//                    console.log("No wifi named Pi_AP in the list.");
//                    callback(false);
//                } else {
//                    console.log("Yes there is a wifi named Pi_AP in the list ! :)");
//                    callback(true);
//                }
//            }
//        });
//    }
//
//    self.connectRpi = function (callback) {
//        isConnected(ic => {
//            if (ic === false) {
//                console.log('not connected yet');
//                searchRpi(ip => {
//                    if (ip === true) {
//                        console.log('found a robot');
//                        child = exec('osx-wifi-cli Pi_AP coucuo', function (error, stdout, stderr) {
//                            if (error !== null){
//                                callback(undefined);
//                            }
//                            self.connectRpi(callback);
//                        });
//
//                    } else {
//                        console.log('no robot found');
//                        callback(false);
//                    }
//                })
//
//            } else {
//                console.log('already connected');
//                callback(true);
//                document.getElementsByClassName("")
//            }
//        });
//
//    };
//
//    return self;
//
//})();

module.exports = Connector;