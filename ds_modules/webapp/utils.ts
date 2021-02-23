// This module is for util functions.

/**
 * This function allows import html code in other
 * html file at the momento of evaluate.
 * @param filename (string): filename.
 * */
function include(filename: string) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}
