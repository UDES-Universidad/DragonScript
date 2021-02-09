/**
 * This module manage Http responses.
 * */
import SETTINGS from '../../Settings';
import { RequestGetInterface } from './server';

export default class Http {
  /**
   * Render html using a html template.
   * */
  public static render(request: {},
    template: string,
    context: {} = {}) {
    if (!request || typeof request !== 'object') throw new Error(
      'request is a required parameter in render function, it must by placed in the first position.'
    );
    const favicon = SETTINGS.getProperty('favicon');
    const title = SETTINGS.getProperty('title');
    const resp = HtmlService.createTemplateFromFile(template);
    resp.request = request;
    if (context && Object.keys(context).length > 0) {
      for (const key in context) {
        if (context.hasOwnProperty(key)) {
          resp[key] = context[key];
        }
      }
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
  public static htmlResponse(html: string) {
    const htmlResponse =  HtmlService.createHtmlOutput(html);
    const favicon = SETTINGS.getProperty('favicon');
    const title = SETTINGS.getProperty('title');
    if (favicon) htmlResponse.setFaviconUrl(favicon);
    if (title) htmlResponse.setTitle(title);
    return htmlResponse;
  }

  /**
   * Response in plain text.
   * */
  public static plainTextResponse(str: string) {
    const favicon = SETTINGS.getProperty('favicon');
    const resp = HtmlService.createHtmlOutput(str);
    if (favicon) resp.setFaviconUrl(favicon);
    return resp;
  }

  /**
   * Response en JSON.
   * */
  public static JSONresponse(data: any) {
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
