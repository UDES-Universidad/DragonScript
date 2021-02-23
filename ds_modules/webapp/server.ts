/**
 * Server module.
 * */
import webAppSettings from './defaultSettings';
import Router from './router';

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

  /**
   * Return a view.
   * */
  public static response(req: RequestGetInterface) {
    const props = webAppSettings();
    const path = req.parameter[props.argumentRoute];
    const debug = Number(props.debug);
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

  /**
   * If something wrong happens.
   * */
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
