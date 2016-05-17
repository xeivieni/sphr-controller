/**
 * Created by clem on 04/05/2016.
 */

var wifi = require('wifi-control');
var settings = require('../etc/config.json')['wifi-settings'];
var request = require("request");

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

    self.send = function(coordinates, callback) {
        var options = { method: 'POST',
            url: 'http://localhost:8000/api/controls/',
            headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                'postman-token': '7a1d9906-b700-e653-6444-6328de07f119',
                'cache-control': 'no-cache',
                authorization: 'Basic Y29udHJvbGVyOnJhc3BiZXJyeQ==' },
            form: coordinates };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(response);
            callback(body);
        });
    };

    return self;
})();

module.exports = Connector;