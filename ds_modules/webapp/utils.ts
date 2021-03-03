// This module is for util functions.

import Router from "./router";

/**
 * This function allows import html code in other
 * html file at the momento of evaluate.
 * @param filename (string): filename.
 * */
function include_(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Loads a component by its name.
 * */
function loadComponent_(name: string, context?: {}) {
  let components;
  try {
    components = components_();
  } catch (error) {
    throw new Error(
      'You must create a components_ function that return a path components.'
    );
  }
  if (name in components) {
    const componentPath = components[name];
    const req = HtmlService.createTemplateFromFile(componentPath);
    const keys = context ? Object.keys(context) : [];
    if (keys.length > 0) {
      keys.forEach((key) => {
        req[key] = context[key];
      });
    }
    return req.evaluate().getContent();
  }
  throw new Error(`Component ${name} is not registered.`);
}

/**
 * Shortcuts
 * */
/**
 * Get Url by Name.
 * */
function getUrlByName_(name) {
  return Router().getUrlByName(name);
}
