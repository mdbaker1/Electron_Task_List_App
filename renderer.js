console.log('from the js page')
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');


/* function to save file to storage *//* 
function saveFile() {
    dialog.showSaveDialog((filename) => {
        if (filename === undefined) {
            return;
        };

        var content = document.getElementById('content').value

        fs.writeFile(filename, content, (err) => {
            if (err) console.log(err);
            alert("List has been saved successfully")
        });
    });
}; */
