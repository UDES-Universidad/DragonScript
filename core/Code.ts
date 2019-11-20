/// <reference path="settings.ts"/>

//Create the output evaluated that allow use libraries.
function doGet(e): any {
    var output = HtmlService.createTemplateFromFile('index').evaluate();
    output.setTitle(SETTINGS.Project_name).addMetaTag('viewport', 'width=device-width, initial-scale=1');

    return output;
}

// Embebed APP
function onOpen(): void {
    let ui = null;
    if (SETTINGS.Menu_name) {
        ui = SpreadsheetApp.getUi().createMenu(SETTINGS.Menu_name);
        for (let option of SETTINGS.Menu_options) {
            if (option.type === 'item') {
                ui.addItem(option.name, option.fn);
            }
        }
        ui.addToUi();
    }
}
