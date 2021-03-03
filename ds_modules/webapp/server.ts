/**
 * Server module.
 * */
import webAppSettings_ from './defaultSettings';
import Router from './router';

// Interfaces
// ------------------------------------------------------------
export interface RequestGetInterface {
  queryString: string;
  contentLength: number;
  parameters: { [key: string]: string[]; };
  pathInfo: string;
  contextPath: string;
  parameter: { [key: string]: string; };
  method: 'GET' | 'POST';
}

export interface RequestPostInterface {
  queryString: string;
  pathInfo: string;
  parameter: { [key: string]: string; };
  contentLength: number;
  contextPath: string;
  postData: any;
  parameters: { [key: string]: string[]; };
}

// Server
// ------------------------------------------------------------

class Server {
  private static _router = Router();

  /**
   * Return a view.
   * */
  public static response(req: RequestGetInterface | RequestPostInterface) {
    const props = webAppSettings_();
    const pathInfo = 'pathInfo' in req ? req.pathInfo : ''
    req.pathInfo = pathInfo;
    const debug = Number(props.debug);
    if (debug) {
      urls_();
      return this._router.getRouteByPath(pathInfo).view(req);
    }
    try {
      urls_();
      return this._router.getRouteByPath(pathInfo).view(req);
    } catch (error) {
      return Server.sendError(500, error.message);
    }
  }

  /**
   * If something wrong happens.
   * */
  public static sendError(code: number, error: string) {

    return ContentService.createTextOutput(
      JSON.stringify({
        status: code,
        error,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet (req: RequestGetInterface) {
  req.method = 'GET';
  return Server.response(req);
}

function doPost (req: RequestPostInterface) {
  req.method = 'POST';
  return Server.response(req);
}
