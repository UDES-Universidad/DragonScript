/**
 * Auxiliary views for router.
 * */

/**
 * If no route found then redirect to this view.
 * @param request ({ [keys: string]: string }): is object obtained from doGet or doPost method.
 * @param template (string): path to template file.
 * @param context ({ [keys: string]: string }): data to be passed to template.
 * */
function routeNotFoundView(
  request: { [keys: string]: string },
  template: string,
  context?: { [keys: string]: string }
) {
  const { favicon, title, metaViewPort, error404Template } = webAppSettings_();
  let output;
  if (template || error404Template) {
    const resp = HtmlService.createTemplateFromFile(
      template || error404Template
    );
    const keys = context ? Object.keys(context) : [];
    if (keys.length > 0) {
      keys.forEach((key) => {
        resp[key] = context[key];
      });
    }
    output = resp.evaluate();
  } else {
    output = HtmlService.createHtmlOutput('<h1>404 not found</h1>');
  }
  if (metaViewPort) output.addMetaTag('viewport', metaViewPort);
  if (favicon) output.setFaviconUrl(favicon);
  if (title) output.setTitle(title);
  if (context && context.hasOwnProperty('setTitle'))
    output.setTitle(context.setTile);
  return output;
}

export default {
  routeNotFoundView,
};
