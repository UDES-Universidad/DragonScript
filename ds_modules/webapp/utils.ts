// This module is for util functions.
import webAppSettings_ from './defaultSettings';
import Router from './router';

/**
 * This function allows import html code in other
 * html file at the momento of evaluate.
 * @param filename (string): filename.
 * */
function include_(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Loads a component by its name, searching in a routes.
 * */
function loadComponent_(name: string, context?: { [keys: string]: any }) {
  const pathErrors: string[] = [];
  let paths: string[] = [];
  let html = '';
  try {
    paths = webAppSettings_().componentPaths;
  } catch (error) {
    throw new Error(
      'You must create a components_ function that return a path components.'
    );
  }
  for (const p of paths) {
    const path = p.substr(p.length - 1) === '/' ? p : `${p}/`;
    const componentPath = `${path}${name}.html`;
    try {
      const req = HtmlService.createTemplateFromFile(componentPath);
      const keys = context ? Object.keys(context) : [];
      if (req && keys.length > 0) {
        keys.forEach((key) => {
          req[key] = context[key];
        });
      }
      html = req.evaluate().getContent();
      break;
    } catch (e) {
      pathErrors.push(componentPath);
    }
  }
  if (html) {
    return html;
  }
  throw new Error(
    `Component ${name} not found in the paths: ${pathErrors.join(', ')}`
  );
}

/**
 * Shortcuts
 * */
/**
 * Get Url by Name.
 * */
function getUrlByName_(name: string) {
  return Router.create().getUrlByName(name);
}
