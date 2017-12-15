const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, dialog, fs } = electron;

let mainWindow;
let addWindow;


// Listen for the app to be ready
app.on('ready', function () {
    /* console.log("electron running") */

    /* Create new window */
    mainWindow = new BrowserWindow({});
    // Load html into window
    //mainWindow.loadURL(`file://${__dirname}/index.html`),
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true,
        width: 600,
        height: 400
    }));

    /* Quit app when closed */
    mainWindow.on('closed', function () {
        app.quit();
    });

    /* Build menu from template */
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    /* Insert menu */
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', function () {
        //console.log('closed');
        mainWindow = null;
    });
});

/* Handle create add window */
function createAddWindow() {
    /* Create new window */
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Task'
    });
    /* Load html into window */
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    /* Garbage collection handle */
    addWindow.on('close', function () {
        addWindow = null;
    });
};

/* function to open file from local storage */
function openFile() {
    dialog.showOpenDialog((filename) => {
        if (filename === undefined) {
            //alert("No file selected");
            return;
        };
        mainWindow.webContents.send('openFile', filename[0]);
    });
};

/* Receive new task */
ipcMain.on('newTask:add', function (e, task) {
    mainWindow.webContents.send('newTask:add', task)
    addWindow.close();
});

/* Create menu template */
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    openFile();
                }

            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }

            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('task:clear');
                }
            }

        ]
    }
];

/*  If MAC, add emtpy object to menu */
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
};

/* Add developer tools menu item if not in prod */
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }

            },
            {
                role: 'reload'
            }
        ]
    });
};

