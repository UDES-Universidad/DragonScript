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
    const parameterRoute = SETTINGS.getProperty('parameterRoute');
    const path = req.parameter[parameterRoute];
    return this._router.getRouteByPath(path).view(req);
  }
}

const doGet = (req: RequestGetInterface) => {
  urls();
  try {
    req.method = 'GET';
    return Server.response(req);
  } catch (error) {
    return HtmlService.createHtmlOutput(error);
  }
};

const doPost = () => {};
