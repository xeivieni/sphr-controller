/**
 * Created by clem on 04/05/2016.
 */

var wifi = require('wifi-control');
var settings = require('../etc/config.json')['wifi-settings'];

// Main module for wifi connection
var Connector = (function () {
    var self = {};
    wifi.init(settings);

    // Function to connect to robot (config = {"ssid": "x", "password": "y"})
    // The response has the following pattern : response = {"success": true or false, "ssid": x}
    self.connect = function (config, callback) {
        wifi.connectToAP(config, function (err, response) {
            if (err) console.log(err); //GERER CA DANS LE CALLBACK ET AFFICHER UN MESSAGE D'ERREUR
            callback(response);
        });
    };

    // Function to scan the available wifi networks
    self.scan = function (callback) {
        wifi.scanForWiFi(function (err, response) {
            if (err) console.log(err); //GERER CA DANS LE CALLBACK ET AFFICHER UN MESSAGE D'ERREUR
            callback(response);
        });
    };

    // Function to get actual wifi network name
    self.getWifi = function (callback) {
        var response = wifi.getIfaceState();
        callback(response);
    };

    return self;
})();

module.exports = Connector;