function doGet() {
  return HtmlService.
  createTemplateFromFile('index').evaluate().setTitle('Title').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
