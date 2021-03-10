/**
 * This module manage Http responses.
 * */
import webAppSettings_ from './defaultSettings';
import { RequestGetInterface } from './server';

export default class Http {
  /**
   * Render HTML using a HTML template.
   * */
  public static render(
    request: {},
    template: string,
    context?: { [keys: string]: any } = {}
  ): GoogleAppsScript.HTML.HtmlOutput {
    if (!request || typeof request !== 'object') {
      throw new Error(
        'request is a required parameter in render function, it must by placed in the first position.'
      );
    }
    let title;
    const { favicon, appName, metaViewPort } = webAppSettings_();
    if ('title' in context && context.title) {
      title = context.title;
    } else {
      title = appName;
    }
    const resp = HtmlService.createTemplateFromFile(template);
    resp.request = request;
    if (context && Object.keys(context).length > 0) {
      Object.entries(context).forEach((i: [string, any]) => {
        const [key, value] = i;
        resp[key] = value;
      });
    }
    const evaluated = resp.evaluate();
    if (metaViewPort) evaluated.addMetaTag('viewport', metaViewPort);
    if (favicon) evaluated.setFaviconUrl(favicon);
    if (title) evaluated.setTitle(title);
    if (context && context.hasOwnProperty('setTitle')) {
      evaluated.setTitle(context.setTile);
    }
    return evaluated;
  }

  /**
   * Return simple html.
   * */
  public static htmlResponse(html: string): GoogleAppsScript.HTML.HtmlOutput {
    const { favicon, appName } = webAppSettings_();
    const htmlresponse = HtmlService.createHtmlOutput(html);
    if (favicon) htmlresponse.setFaviconUrl(favicon);
    if (appName) htmlresponse.setTitle(appName);
    return htmlresponse;
  }

  /**
   * Response in plain text.
   * */
  public static plainTextResponse(
    str: string
  ): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(str).setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  /**
   * Response en JSON.
   * */
  public static JSONresponse(data: any): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  /**
   * Redirect request to some direction.
   * @param request ({ [keys: string]: any; })
   * @param url (string)
   * @param template (string)
   * @param context ({ [keys: string]: any; })
   * */
  public static redirect(
    request: { [keys: string]: any },
    url: string,
    template?: string,
    context?: { [keys: string]: any }
  ) {
    const redirect = Http.render(
      request,
      template || webAppSettings_().redirectTemplate,
      { url, ...context }
    );
    redirect.append(`
      <script>
        window.open('${url}', '_top');
      </script>
    `);
    return redirect;
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
