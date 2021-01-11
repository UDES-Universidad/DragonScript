/**
 * Router module.
 * */
/**
 * Router module.
 * */

import SETTINGS from '../../Settings';

interface RouteInterface {
  name: string;
  path: string;
  view: (template: any) => string;
}

/**
 * Router.
 * */
class RouterSingleton {
  private static instance: RouterSingleton;

  private _routes:(RouteInterface | [string, RouteInterface[]])[] = [];

  private constructor() {

  }

  private getInstance() {
    if (!RouterSingleton.instance) {
      RouterSingleton.instance = new RouterSingleton();
    }

    return RouterSingleton.instance;
  }

  private _getRoutesByMode(mode: 'single' | 'group'): RouteInterface[] | [string, RouteInterface[]][] {
    if (mode === 'single') {
      return <RouteInterface[]>
        this._routes.filter((i) => !Array.isArray(i));
    }
    if (mode === 'group') {
      return <[string, RouteInterface[]][]>
        this._routes.filter((i) => Array.isArray(i));
    }
    throw new Error('There is no routes!');
  }

  /**
   * Return url web app depending on whether a
   * SETTINGS.debug is in 0 (false) or 1 (true).
   * */
  public getScriptUrl() {
    const debug = Number(SETTINGS.getProperty('debug'));
    if (debug === 1) return SETTINGS.getProperty('urlDev');
    return SETTINGS.getProperty('urlProd');
  }

  /**
   * Add simple route.
   * */
  public addRoute(route: RouteInterface) {
    if (typeof route === 'object' && !Array.isArray(route)) {
      //const routes = this._routes.
    }
  }

  /**
   * Add complex route.
   * */
  public addGroupRoutes(routes: [string, RouteInterface[]]) {

  }

  /**
   * Get a route from name that can be used in two ways:
   * 1. single path name, for example: myRouteName.
   * 2. group: groupName:routeName, that is a set of routes.
   * */
  public getRouteByName(name: string): RouteInterface {
    if (name.includes(':')) {
      const [groupName, routeName] = name.trim().split(':');
      const appRoutes = this._getRoutesByMode('group')
        .filter(
          (i: [string, RouteInterface[]]) => i[0] === groupName,
        );
      if (appRoutes.length > 0) {
        const routes = appRoutes[0][1]
          .filter((i: RouteInterface) => i.name === routeName);
        if (routes.length > 0) return routes[0];
      }
    } else {
      const routes = this._getRoutesByMode('single')
        .filter((i: RouteInterface) => i.name === name);
      if (routes.length > 0) return routes[0];
    }
    throw new Error('Route not exists!');
  }

  /**
   * Get an absolute route by the name.
   * */
  public getAbsoluteUrl(name: string) {
    const routeArg = SETTINGS.getProperty('argumentRoute');
    const route = this.getRouteByName(name);
    let urlBase = this.getScriptUrl();
    urlBase = urlBase?.substr(-1) === '/'
      ? urlBase
      : `${urlBase}/`;
    return `${urlBase}?${routeArg}=${route}`;
  }
}

const Router = (): RouterSingleton => {
  return new RouterSingleton();
}

export default Router;
