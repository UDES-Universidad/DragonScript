/**
 * Server module.
 * */

import Router from './router';
import SETTINGS from '../../Settings';
//import urls from '../../GASwebAppTest/urls'

// Interfaces
// ------------------------------------------------------------
export interface RequestGetInterface {
  queryString: string;
  contentLength: number;
  parameters: {};
  contextPath: string;
  parameter: {};
  method: 'GET' | 'POST';
}

// Server
// ------------------------------------------------------------

class Server {
  private static _router = Router();

  public static response(req: RequestGetInterface) {
    const argumentRoute = SETTINGS.getProperty('argumentRoute');
    const path = req.parameter[argumentRoute];
    const debug = Number(ScriptProperties.getProperty('debug'));
    if (debug) {
      urls();
      return this._router.getRouteByPath(path).view(req);
    }
    try {
      urls();
      return this._router.getRouteByPath(path).view(req);
    } catch (error) {
      return Server.sendError(500, error.message);
    }
  }

  public static sendError(code: number, error:string) {
    return ContentService.createTextOutput(JSON.stringify({
      status: code,
      error,
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

const doGet = (req: RequestGetInterface) => {
  req.method = 'GET';
  return Server.response(req);
};

const doPost = () => {};
