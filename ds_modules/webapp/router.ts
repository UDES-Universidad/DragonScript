/**
 * Router module.
 * */
import webAppSettings_ from './defaultSettings';

interface RouteInterface {
  name: string;
  path: string;
  __path__?: string;
  view: (template: any) => string;
}

/**
 * Router.
 * */
class RouterSingleton {
  private static instance: RouterSingleton;

  private _routes: (RouteInterface | [string, RouteInterface[]])[] = [];

  /**
   * Get a RouterSingleton instance.
   * */
  public static getInstance() {
    if (!RouterSingleton.instance) {
      RouterSingleton.instance = new RouterSingleton();
    }
    return RouterSingleton.instance;
  }

  /**
   * Get routes by single or group mode.
   * */
  private _getRoutesByMode(mode: 'single' | 'group'): RouteInterface[] | [string, RouteInterface[]][] {
    if (mode === 'single') {
      return <RouteInterface[]>this._routes.filter((i) => !Array.isArray(i));
    }
    if (mode === 'group') {
      return <[string, RouteInterface[]][]>this._routes.filter((i) => Array.isArray(i));
    }
    throw new Error('There is no routes!');
  }

  /**
   * Join paths.
   * */
  private _joinPaths(parts: string[]) {
    let result = '';
    for (const part of parts) {
      for (const chunk of part.split('/')) {
        if (chunk) result += `${chunk}/`;
      }
    }
    return result;
  }

  /**
   * Return url web app depending on whether a
   * ScriptPropertiescript.debug is in 0 (false) or 1 (true).
   * */
  public getScriptUrl() {
    const props = webAppSettings_();
    const debug = Number(props.debug);
    if (debug === 1) return props.urlDev;
    return props.urlProd;
  }

  /**
   * Add simple route.
   * */
  public addRoute(route: RouteInterface) {
    if (typeof route !== 'object' && Array.isArray(route)) throw new Error('Route must be an object.');
    if (!route.name) throw new Error('Route must has a name.');
    if (typeof route.path !== 'string' || route.path === undefined || route.path === null) {
      throw new Error('Route must has a path.');
    }
    if (!route.view) throw new Error('Route must has a view;');
    this._routes.push(route);
  }

  /**
   * Add a set of routes.
   * */
  public addGroupRoutes(routes: [string, RouteInterface[]]) {
    if (Array.isArray(routes)) {
      if (typeof routes[0] === 'string') {
        routes[1].forEach((i) => {
          if (!i.name && !i.path && i.view) throw new Error('Routes are incompletes');
        });
        this._routes.push(routes);
      }
    }
  }

  /**
   * If no route found.
   * */
  public routeNotFound(request: {}, template: string, context?: {}) {
    let { favicon, title, metaViewPort, error404Template } = webAppSettings_();
    let output;
    if (template || error404Template) {
      const resp = HtmlService.createTemplateFromFile(template || error404Template);
      const keys = context ? Object.keys(context) : [];
      if (keys.length > 0) {
        keys.forEach((key) => {
          resp[key] = context[key];
        });
      }
      output = resp.evaluate();
    } else {
      output = HtmlService.createHtmlOutput(`<h1>404 not found</h1>`);
    }
    if (metaViewPort) output.addMetaTag('viewport', metaViewPort);
    if (favicon) output.setFaviconUrl(favicon);
    if (title) output.setTitle(title);
    if (context && context.hasOwnProperty('setTitle')) output.setTitle(context.setTile);
    return output;
  }

  /**
   * Get a route from name that can be used in two ways:
   * 1. single path name, for example: myRouteName.
   * 2. group: groupName:routeName, that is a set of routes.
   * */
  public getRouteByName(name: string): RouteInterface {
    if (name.includes(':')) {
      const [groupName, routeName] = name.trim().split(':');
      const groupRoutes = this._getRoutesByMode('group').filter((i: [string, RouteInterface[]]) => i[0] === groupName);
      if (groupRoutes.length > 0) {
        const routes = groupRoutes[0][1].filter((i: RouteInterface) => i.name === routeName);
        if (routes.length > 0) {
          routes[0].__path__ = this._joinPaths([groupName, routes[0].path]);
          return routes[0];
        }
      }
    } else {
      const routes = this._getRoutesByMode('single').filter((i: RouteInterface) => i.name === name);
      if (routes.length > 0) {
        routes[0].__path__ = routes[0].path;
        return routes[0];
      }
    }
    throw new Error('Route not exists!');
  }

  /**
   * Get a route by path.
   * */
  public getRouteByPath(pathInfo: string): RouteInterface {
    let path = pathInfo || '';
    if (path === '/') path = '';
    for (const item of this._routes) {
      if (Array.isArray(item)) {
        for (const route of item[1]) {
          const pathBuilded = this._joinPaths([item[0], route.path]);
          if (pathBuilded === path) {
            route.__path__ = pathBuilded;
            return route;
          }
        }
      } else if (item.path === path) {
        return item;
      }
    }
    let error404;
    if (!Array.isArray(this._routes[0]) && this._routes[0].name === 'error404') {
      error404 = this._routes[0];
    } else {
      error404 = {
        name: 'error404',
        path: '404',
        view: this.routeNotFound,
      };
    }
    return error404;
  }

  /**
   * Get an absolute route by the name.
   * */
  public getUrlByName(name: string) {
    const props = webAppSettings_();
    let route = this.getRouteByName(name);
    route = route.__path__ ? `/${route.__path__}` : '';
    const urlBase = this.getScriptUrl();
    return `${urlBase}${route}`;
  }
}

const Router = (): RouterSingleton => RouterSingleton.getInstance();

export default Router;
