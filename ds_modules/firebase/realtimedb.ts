/**
 * Firebase class handler.
 * */

interface SecretsFireConnector {
  privateKey: string;
  clientEmail: string;
  urlDB: string;
}

interface RequestConf {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
  headers?: { [keys: string]: string };
  payload?: { [keys: string]: string };
  autoId?: boolean;
}

interface FiltersConf {
  orderBy: string;
  limitToFirst?: string;
  limitToLast?: string;
  startAt?: string;
  endAt?: string;
  equalTo?: string;
}

interface UrlComposerConf {
  path: string;
  filters?: FiltersConf;
}

class RealTime {
  private _PRIVATE_KEY: string = '';

  private _CLIENT_EMAIL: string = '';

  private _URL_DB: string = '';

  private _service?;

  constructor(secrets: SecretsFireConnector) {
    this._setSecrets(secrets);
    this._getService();
  }

  /**
   * Get data from script store.
   * */
  private _setSecrets(secrets: SecretsFireConnector) {
    this._PRIVATE_KEY = secrets.privateKey;
    this._CLIENT_EMAIL = secrets.clientEmail;
    this._URL_DB = secrets.urlDB;
  }

  /**
   * Creates a service.
   * */
  private _getService() {
    this._service = OAuth2.createService('Firebase')
      // Set the endpoint URL.
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the private key and issuer.
      .setPrivateKey(this._PRIVATE_KEY)
      .setIssuer(this._CLIENT_EMAIL)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scopes.
      .setScope(
        'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database'
      );
  }

  /**
   * Reset the authorization state, so that it can be re-tested.
   */
  public resetService() {
    this._service.reset();
  }

  /**
   * Get Access Token.
   * */
  private _getToken() {
    const service = this._service;
    if (service.hasAccess()) {
      return service.getAccessToken();
    }
    throw new Error('Do not have access to database.');
  }

  /**
   * Makes a request for data.
   * */
  private _request(conf: RequestConf) {
    const options: {
      method: string;
      muteHttpExceptions: boolean;
      headers?: { [keys: string]: string | number };
      payload?: string;
    } = {
      method: conf.method,
      muteHttpExceptions: true,
      headers: {
        'X-Firebase-Decoding': 1,
        'Content-type': 'application/json',
        Authorization: `Bearer ${this._getToken()}`,
      },
    };
    if (!('autoId' in conf && conf.autoId === true) && conf.method !== 'GET') {
      options.headers['X-HTTP-Method-Override'] = 'PATCH';
    }
    if ('payload' in conf && Object.keys(conf.payload).length > 0) {
      options.payload = JSON.stringify(conf.payload);
    }
    const response = UrlFetchApp.fetch(conf.url, options);
    return JSON.parse(response.getContentText());
  }

  /**
   * Creates url.
   * */
  private _urlComposer(conf: UrlComposerConf) {
    const urlFixed =
      this._URL_DB.substr(this._URL_DB.length - 1) === '/'
        ? this._URL_DB
        : `${this._URL_DB}/`;
    const pathFixed =
      conf.path.charAt(0) === '/' ? conf.path.substr(1) : conf.path;
    let url = `${urlFixed}${pathFixed}.json`;
    let filters;
    if ('filters' in conf && Object.keys(conf.filters).length > 0) {
      filters = conf.filters;
      if (!('orderBy' in filters)) {
        throw new Error('orderBy is required.');
      }
      url += `?orderBy="${filters.orderBy}"`;
      if ('limitToFirst' in filters) {
        url += `&limitToFirst="${filters.limitToFirst}"`;
      }
      if ('limitToLast' in filters) {
        url += `&limitToLast="${filters.limitToLast}"`;
      }
      if ('startAt' in filters) {
        url += `&startAt="${filters.startAt}"`;
      }
      if ('endAt' in filters) {
        url += `&endAt="${filters.endAt}"`;
      }
      if ('equalTo' in filters) {
        url += `&equalTo="${filters.equalTo}"`;
      }
    }

    return encodeURI(url);
  }

  public getData(conf: { path: string; filters?: FiltersConf }) {
    const data: { path: string; filters?: FiltersConf } = {
      path: conf.path,
    };
    if ('filters' in conf && conf.filters) {
      data.filters = conf.filters;
    }
    const url = this._urlComposer(data);
    const request = this._request({
      url,
      method: 'GET',
    });
    return request;
  }

  public setData(conf: {
    path: string;
    payload: { [keys: string]: string };
    autoId: boolean;
    method: 'POST' | 'PUT' | 'PATCH';
  }) {
    const obj = { ...conf };
    delete obj.path;
    if (!('method' in conf)) {
      obj.method = 'POST';
    }
    if (!('autoId' in conf)) {
      obj.autoId = false;
    }
    const url = this._urlComposer({ path: conf.path });
    const request = this._request({
      url,
      ...obj,
    });
    return request;
  }
}

/**
 * Realtime database client
 * */
class RealtimeDB {
  public static create(secrets: SecretsFireConnector) {
    return new RealTime(secrets);
  }
}

export default RealtimeDB;
