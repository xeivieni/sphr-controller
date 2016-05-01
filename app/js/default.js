/**
 * Created by clem on 18/04/2016.
 */
(function () {

    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');

    function init() {
        document.getElementById("min-btn").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.maximize();
        });

        document.getElementById("close-btn").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });

        document.getElementById("set-btn").addEventListener("click", function (e) {
            console.log('coucou');
        });
    }

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };

})();