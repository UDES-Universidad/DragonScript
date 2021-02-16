// This module is for util functions.

/**
 * This function allows import html code in other
 * html file at the momento of evaluate.
 * @param filename (string): filename.
 * */
const include = (filename: string) => HtmlService
  .createHtmlOutputFromFile(filename)
  .getContent();
