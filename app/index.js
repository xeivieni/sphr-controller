var app = require('app');
var browserWindow = require('browser-window');

app.on('ready', function(){
    var mainWindow = new browserWindow({
    width: 1200,
    height: 700,
    title: "Sph-R",
    frame: false,
    skipTaskbar: true,
    transparent: true,
    useContentSize:true
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
});
