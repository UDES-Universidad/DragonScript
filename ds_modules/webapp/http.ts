/**
 * This module manage Http responses.
 * */
import webAppSettings from './defaultSettings';
import { RequestGetInterface } from './server';

export default class Http {
  /**
   * Render HTML using a HTML template.
   * */
  public static render(request: {},
    template: string,
    context: {} = {}): GoogleAppsScript.HTML.HtmlOutput {
    if (!request || typeof request !== 'object') throw new Error(
      'request is a required parameter in render function, it must by placed in the first position.'
    );
    const { favicon, title } = webAppSettings();
    const resp = HtmlService.createTemplateFromFile(template);
    resp.request = request;
    if (context && Object.keys(context).length > 0) {
      Object.entries(context).forEach((i: [string, any]) => {
        const [key, value] = i;
        resp[key] = value;
      });
    }
    const evaluated = resp.evaluate();
    if (favicon) evaluated.setFaviconUrl(favicon);
    if (title) evaluated.setTitle(title);
    if (context.hasOwnProperty('setTitle')) evaluated.setTitle(context.setTile)
    return evaluated;
  }

  /**
   * Return simple html.
   * */
  public static htmlResponse(html: string): GoogleAppsScript.HTML.HtmlOutput {
    const { favicon, title } = webAppSettings();
    const htmlresponse = HtmlService.createHtmlOutput(html);
    if (favicon) htmlresponse.setFaviconUrl(favicon);
    if (title) htmlresponse.setTitle(title);
    return htmlresponse;
  }

  /**
   * Response in plain text.
   * */
  public static plainTextResponse(str: string): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(str)
      .setMimeType(ContentService.MimeType.TEXT);
  }

  /**
   * Response en JSON.
   * */
  public static JSONresponse(data: any): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// class ViewFactory extends View {
//   public template: string;
// 
//   public onErrorTemplate: string;
// 
//   private _context: {};
// 
//   public addContext(key: string, value: any) {
//     this._context[key] = value;
//   }
// 
//   private genericResponse() {
//     try {
//       return ViewFactory.render(this.template, this._context);
//     } catch (error) {
//       return ViewFactory.render(this.onErrorTemplate, {error});
//     } catch (error) {
//       return ViewFactory.response(error.message);
//     }
//   }
// 
//   public view(request: RequestGetInterface) {
//     this.addContext('request', request);
//     let response;
//     if (request.method === 'GET') response = this.doGet(request);
//     if (request.method === 'POST') response = this.doPost(request);
//     if (response) return response;
//     return this.genericResponse();
//   }
// 
//   public doGet: (request: RequestGetInterface) => GoogleAppsScript.HTML.HtmlService;
// 
//   public doPost: (request: RequestGetInterface) => GoogleAppsScript.HTML.HtmlService;
// }
