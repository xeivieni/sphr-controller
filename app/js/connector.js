/**
 * Created by clem on 04/05/2016.
 */

var wifi = require('wifi-control');
var config = require('../etc/config.json');

var settings = config['wifi-settings'];

var Connector = (function () {
    var self = {};
    wifi.init(settings);

    self.connect = function (config, callback) {
        wifi.connectToAP(config, function (err, response) {
            if (err) console.log(err); //GERER CA DANS LE CALLBACK ET AFFICHER UN MESSAGE D'ERREUR
            callback(response);
        });
    };

    self.scan = function (callback) {
        wifi.scanForWiFi(function (err, response) {
            if (err) console.log(err); //GERER CA DANS LE CALLBACK ET AFFICHER UN MESSAGE D'ERREUR
            callback(response);
        });
    };

    self.getWifi = function (callback) {
        var response = wifi.getIfaceState();
        callback(response);
    };

    return self;
})();

module.exports = Connector;