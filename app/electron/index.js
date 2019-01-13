import { BrowserWindow, app } from 'electron';

let mainWindow;
let winUrl;
function createWindow() {
    const isDev = require('electron-is-dev');

    /*
    * Initial window options
    */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    });

    winUrl = 'file://' + __dirname + '/index.html'

    if (isDev) {
        const fs = require('fs');

        let interval = setInterval(() => {
            fs.access(__dirname + "/render.js", fs.F_OK, (err) => {
                if(!err) {
                    mainWindow.loadURL(winUrl);
                    
                    require('electron-debug')({ showDevTools: true });
                    const installExtension = require('electron-devtools-installer');
                    installExtension.default(installExtension.VUEJS_DEVTOOLS)
                        .then(() => {})
                        .catch((err) => {
                            console.log('Unable to install `vue-devtools`: \n', err);
                    });
            
                    mainWindow.webContents.openDevTools();

                    clearInterval(interval);
                }
            })
        }, 1000);
    }
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
