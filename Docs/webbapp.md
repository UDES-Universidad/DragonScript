# Web App

This module allows create an easy Web App.

## Quick start

This example uses TypeScript and [Google Clasp](https://developers.google.com/apps-script/guides/clasp).

Create a new [Google App Script standalone](https://developers.google.com/apps-script/guides/standalone).

Use DrangoScript manager to create a new project: `node ds-manager.js startproject`.

When the manager ask you for the modules that it will use write: webapp.

Execute `node ./ds-manager.js app -pull`.

In the DragonExample directory inner your project directory create two files: **http.ts** and **urls.ts**.

### Project structure

      DragonExample
      ├── Settings.ts
      ├── ds_modules
      │   ├── interfaces.ts
      │   └── webapp
      │        ├── forms.ts
      │        ├── http.ts
      │        ├── router.ts
      │        ├── server.ts
      │        └── utils.ts
      └── DragonExample
          ├── urls.ts
          └── views.ts

### Settings.ts

    function settings_ = () => {
      return {
        debug: 0,
        urlProd: 'https://google.com/myScriptURL-production',
        urlDev: 'https://google.com/myScriptURL-dev',
      };
    }

### views.ts

    // This module imports Https module.
    import Http from '../ds_modules/webapp/http';

    /**
    * This module simply render a "Hello, World!" in
    * plain text.
    */
    export default const helloWorld = (request: { parameters: {} }) => {
      return Http.plainTextResponse('Hello, World!')
    }

### urls.ts

A urls functions is needed declared in any place of project, but is a good practice create a file called **urls.ts** to create this function.

    // This module manages urls.
    import Router from '../ds_modules/webapp/router';
    import helloWorld from './views';

    const urls_ = () => {
      const paths = Router();

      /**
       * Route to your helloWorld http.
       * */
      paths.addRoute({
        name: 'helloWorld',
        path: 'hello',
        view: helloWorld,
      });
    };

### Last steps

Do `clasp push` or `node ./manage.js app -push`.

And implements your [web app](https://developers.google.com/apps-script/guides/web).

Now in search bar browser write: your-url-project?path=hello

That is all.

## Function Views

Views are functions that returns a http response.

Http responses are contained in the class Http. You can import this class by this way: `import Http from '../ds_modules/webapp/http';`.

Http class contains next static methods:

**plainTextResponse(str: string)**: recibe a string and returns a simple string.

**JSONresponse(data: any)**: recibe a Javascript code and returns a JSON.

**htmlResponse(html: string)**: recibe a html in string and return a html.

**render(request: {}, template: string, context: {})**: recibe a request object, template is the path to template in
Google Apps Script syntax, and context, values that will rendered in the template. Return a html.

## urls\_

To create a new route we need to use a **Router** class. All routes that you create must be inner a function called **urls\_**, that can be declared in any place, but we recommend create a file only for this purpose. You can import a router by this way: `import Router from '../ds_modules/webapp/router';`

## Router

### Add routes

With a **Rauter** class you can create a new routes and get an absolute path from a resource by its name.

To create a single route:

    Router().addRoute({
      name: 'This_is_a_name_for_my_route',
      path: '/this/is/my/path',
      view: here_put_your_function_view,
    })

Browser URL bar: GAS-url/exec?path=/this/is/my/path

Also you can create a group routes:

    Router().addGroupRoutes([
      'NameGroup',
      [
        {
          name: 'route1',
          path: '/this/is/my/path/1',
          view: view1,
        }
        {
          name: 'route2',
          path: '/this/is/my/path/2',
          view: view2,
        }
        ...
      ]
    ])

Browser URL bar:

- GAS-url/exec?path=groupName/this/is/my/path/1

- GAS-url/exec?path=groupName/this/is/my/path/2

### Get a absolute route by name

You can get a absolute url (route) doing:

    // Single route
    Router().getUrlByName('myRouteName');
    // Route in group
    Router().getUrlByName('groupName:routeName');

This function returns: `GAS-url/exec?path=your/rotue/path`.

Also you can do it this in a template:

    ...
      <a href="<?= Router().getUrlByName('routeName') ?>" target="_top">
        My link to another page.
      </a>
    ...

## Utils

This module includes this functions:

### includes_(filename: string)

This function allows import html code in other html file at the momento of evaluate.

#### Parameters

| Name     | Type   | Description                                  |
| -------- | ------ | -------------------------------------------- |
| filename | string | Name of file to be included in another file. |

### loadComponent_(name: string, context?: { [keys: string]: any })

This function load a component. Component is a piece of code to be added in some HTML file.

#### Parameters

| Name    | Type                     | Description                         |
| ------- | ------------------------ | ----------------------------------- |
| name    | string                   | Component file name                 |
| context | { [keys: string]: any; } | Context to be evaluated in the file |

Example: `<?!= loadComponent_('MyComponent', { title: 'Sometile', myVar: 'This is some var' }) ?>`

# Modules

## Server Module

### class Server

This module is a class that handle requests and redirect request GET or POST to correct route. By now only handles GET requests.

#### static response(req)

This a static method of server that redirect to correct route according to value passed in path GET parameter.

##### Parameters

| Name  | Type                  | Description                   |
| ----- | --------------------- | ----------------------------- |
| `req` | `RequestGetInterface` | Contains a request parameters |

RequestGetInterface:

| Name            | Type            |
| --------------- | --------------- |
| `queryString`   | `string`        |
| `contentLength` | `number`        |
| `parameters`    | `{}`            |
| `contextPath`   | `string`        |
| `parameter`     | `string`        |
| `method`        | `GET` or `POST` |

### doGet(req: RequestGetInterface)

Execute a Server.response that returns a route.

### doPost()

Not used yet.

## Router Module

### Router()

#### Return

Return a instance of `RouterSingleton`.

### class RouterSingleton

This class is a singleton that handles routes and "URLs". URLs is a metaphor because is not possible manipulate the URL of the script, so for emulate that manipulation we use a GET parameter called `path`.

Its possible change

#### addRoute(route)

Add a route to router.

##### Parameters

| Name    | Type             |
| ------- | ---------------- |
| `route` | `RouteInterface` |

###### RouteInterface

| Name   | Type     | Description                                       |
| ------ | -------- | ------------------------------------------------- |
| `name` | `string` | Name to route.                                    |
| `path` | `string` | Path to resource (my/resource/path).              |
| `view` | `HTTP`   | HTTP function that returns a HTML, string or JSON |

#### addGroupRoutes(routes)

Add a set of routes.

##### Parameters

| Name     | Type                         | Description                                                                 |
| -------- | ---------------------------- | --------------------------------------------------------------------------- |
| `routes` | `[string, RouteInterface[]]` | The first item of array is the name of set, second item is a set of routes. |

#### static getInstance()

This static function checks if a instance exists yet, if not creates a new instance.

##### Return

Returns a instance of singleton.

#### getRouteByName(name)

Get a route from name that can be used in two ways:

1. **single** path name, for example: myRouteName.

2. **group**: `groupName:routeName`, that is a set of routes.

##### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `name` | `string` | Route name  |

##### Return

`RouteInterface`

#### getRouteByPath(pathStr)

Get a route by path.

##### Parameters

| Name      | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `pathStr` | `string` | Path taken from GET argument. |

##### Return

`RouteInterface`

#### getScriptUrl()

Return URL Web App depending on whether a ScriptProperties.debug is in 0 or 1.

##### Return

`String`

#### getUrlByName(name)

Get an absolute route by the path name.

##### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `name` | `string` | Path name.  |

##### Return

URL `string`

## HTTP Module

### class Http

#### static render(request, template, context)

Render HTML using a HTML.

##### Parameters

| Name       | Type     | Description                                                                        |
| ---------- | -------- | ---------------------------------------------------------------------------------- |
| `request`  | `{}`     | Request taken from doGet or doPost functions.                                      |
| `template` | `string` | Template path: myDirectory/myfile.html.                                            |
| `context`  | `{}`     | Pairs key/values to use in template, keys will be transform in template variables. |

##### Return

`GoogleAppsScript.HTML.HtmlOutput`

#### static htmlResponse(html)

Receive a HTML string and return a HTML response.

##### Parameters

| Name   | Type     | Description  |
| ------ | -------- | ------------ |
| `html` | `string` | HTML string. |

##### Return

`GoogleAppsScript.HTML.HtmlOutput`

#### static plainTextResponse(str)

Return a plainTextResponse.

##### Parameters

| Name  | Type     | Description     |
| ----- | -------- | --------------- |
| `str` | `string` | String to show. |

##### Return

`GoogleAppsScript.Content.TextOutput`

#### static JSONresponse(data)

Return JSON.

##### Parameters

| Name   | Type  | Description            |
| ------ | ----- | ---------------------- |
| `data` | `any` | Data to return as JSON |

##### Return

`GoogleAppsScript.Content.TextOutput`
