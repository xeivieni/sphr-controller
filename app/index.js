var app = require('app');
var browserWindow = require('browser-window');
var ipc = require('electron').ipcMain;
var Menu = require('menu');
var config = require('./etc/config.json')['display'];


app.on('ready', function(){
    var mainWindow = new browserWindow({
        width: parseInt(config["width"]),
        height: parseInt(config["height"]),
        title: "Sphr Motion",
        skipTaskbar: true,
        useContentSize:true
    });

    mainWindow.on('closed', function () {
        app.quit();
    });

    var menu = Menu.buildFromTemplate([
        {
            label: 'Sphr Motion',
            submenu: [
                {
                    label: 'About Sphr Motion',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Settings',
                    accelerator: 'Command+S',
                    click: function() {
                        if (settingsWindow.isVisible()){
                            settingsWindow.hide();
                        } else {
                            settingsWindow.show();
                        }
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide Sphr Motion',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                {
                    label: 'Show All',
                    selector: 'unhideAllApplications:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function() { app.quit(); }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: function() { mainWindow.reloadIgnoringCache(); }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+Command+I',
                    click: function() { mainWindow.toggleDevTools(); }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    var settingsWindow = new browserWindow({ width: 800, height: 500, show: false, frame: false, minHeight:600, minWidth:800 });
    settingsWindow.on('close', function (event) {
        settingsWindow = null;
    });

    settingsWindow.loadURL('file://' + __dirname + '/prefs.html');
    //settingsWindow.openDevTools();

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //mainWindow.openDevTools();


    ipc.on('toogle-settings', function(event, args) {
        if (settingsWindow.isVisible()) {
            settingsWindow.hide();
        } else {
            settingsWindow.show();
        }
    });

    ipc.on('quit-app', function(event, args) {
        app.quit();
    })
});



