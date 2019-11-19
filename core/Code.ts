//Create the output evaluated, that allow use libraries.
function doGet(): any {
    var output = HtmlService.createTemplateFromFile('index').evaluate();
    output.setTitle('ProjectName').addMetaTag('viewport', 'width=device-width, initial-scale=1');

    return output;
}

// Embebed APP
function onOpen(): void {
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .createMenu('UDES Tools')
        .addItem('Control de horas', 'showSidebar')
        .addToUi();
}

function showSidebar(): void {
    let ui = HtmlService.createTemplateFromFile('index').evaluate()
        .setTitle('Panel de control');
    SpreadsheetApp.getUi().showSidebar(ui);
}

function include(filename: string) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}
