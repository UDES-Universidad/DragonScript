//Create the output evaluated, that allow use libraries.
function doGet() {
  var output = HtmlService.createTemplateFromFile('index').evaluate();
  output.setTitle('Solicitud de Beca').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
  return output;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

//Main Spreadsheet used like database or data repo.
var idDB = 'xyxyxyxyxyxyxyx';
