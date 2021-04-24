/**
 * Router module.
 * */
import webAppSettings_ from './defaultSettings';
import { routeNotFoundView } from './routeViews';

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
   * If no route found then redirect to this view.
   * @param request ({ [keys: string]: string }): is object obtained from doGet or doPost method.
   * @param template (string): path to template file.
   * @param context ({ [keys: string]: string }): data to be passed to template.
   * */
  public routeNotFound = routeNotFoundView;

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
  private _getRoutesByMode(
    mode: 'single' | 'group'
  ): RouteInterface[] | [string, RouteInterface[]][] {
    if (mode === 'single') {
      return <RouteInterface[]>this._routes.filter((i) => !Array.isArray(i));
    }
    if (mode === 'group') {
      return <[string, RouteInterface[]][]>(
        this._routes.filter((i) => Array.isArray(i))
      );
    }
    throw new Error('There is no routes!');
  }

  /**
   * Join paths.
   * @param parts (string[]): strings to create a route.
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
   * Return URL web app depending on if a
   * settings_().debug is in 0 (false) or 1 (true).
   * */
  public getScriptUrl() {
    const props = webAppSettings_();
    const debug = Number(props.debug);
    if (debug === 1) {
      return props.urlDev;
    }
    if (props.urlProd) {
      return props.urlProd;
    }
    return ScriptApp.getService().getUrl();
  }

  /**
   * Add simple route.
   * @param name (string): name of route.
   * @param path (string): route.
   * @param view (template view): function to serve content.
   * */
  public addRoute(route: RouteInterface) {
    if (typeof route !== 'object' && Array.isArray(route))
      throw new Error('Route must be an object.');
    if (!route.name) throw new Error('Route must has a name.');
    if (
      typeof route.path !== 'string' ||
      route.path === undefined ||
      route.path === null
    ) {
      throw new Error('Route must has a path.');
    }
    if (!route.view) throw new Error('Route must has a view;');
    this._routes.push(route);
  }

  /**
   * Add a set of routes.
   * @param routes ([string, RouteInterface[]]): a set of routes.
   * Example: [
   *    routeName,
   *    [
   *      {
   *        name: string,
   *        path: string,
   *        view: viewFunction,
   *      }...
   *    ]
   * ]
   * */
  public addGroupRoutes(routes: [string, RouteInterface[]]) {
    if (Array.isArray(routes)) {
      if (typeof routes[0] === 'string') {
        routes[1].forEach((i) => {
          if (!i.name && !i.path && i.view)
            throw new Error('Routes are incompletes');
        });
        this._routes.push(routes);
      }
    }
  }

  /**
   * Get a route from name that can be used in two ways:
   * 1. single path name, for example: myRouteName.
   * 2. group: groupName:routeName, that is a set of routes.
   * @param name (string): route name.
   * */
  public getRouteByName(name: string): RouteInterface {
    // Group routes.
    if (name.includes(':')) {
      const [groupName, routeName] = name.trim().split(':');
      const groupRoutes = this._getRoutesByMode('group').filter(
        (i: [string, RouteInterface[]]) => i[0] === groupName
      );
      if (groupRoutes.length > 0) {
        const routes = groupRoutes[0][1].filter(
          (i: RouteInterface) => i.name === routeName
        );
        if (routes.length > 0) {
          // Creates a partial route.
          routes[0].__path__ = this._joinPaths([groupName, routes[0].path]);
          return routes[0];
        }
      }
      // Single route.
    } else {
      const routes = this._getRoutesByMode('single').filter(
        (i: RouteInterface) => i.name === name
      );
      if (routes.length > 0) {
        // Creates a partial route.
        routes[0].__path__ = routes[0].path;
        return routes[0];
      }
    }
    throw new Error('Route not exists!');
  }

  /**
   * Get a route by path. This method is used by server class in doGet and doPost functions
   * for return a correct view.
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
    if (
      !Array.isArray(this._routes[0]) &&
      this._routes[0].name === 'error404'
    ) {
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
    const urlBase = this.getScriptUrl();
    const route = this.getRouteByName(name);
    let subroute;
    if (props.routeMehtod === 'parameter') {
      subroute = route.__path__ ? `?${props.pathParam}=${route.__path__}` : '';
    }
    if (props.routeMehtod === 'url') {
      subroute = route.__path__ ? `/${route.__path__}` : '';
    }
    return `${urlBase}${subroute}`;
  }
}

class Router {
  public static create(): RouterSingleton {
    return RouterSingleton.getInstance();
  }
}

export default Router;
