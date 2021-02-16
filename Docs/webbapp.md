# Web App Module

This module allows create an easy Web App.

## Quick start

This example uses TypeScript and [Google Clasp](https://developers.google.com/apps-script/guides/clasp).

Create a new [Google App Script standalone](https://developers.google.com/apps-script/guides/standalone).

Use DrangoScript manager to create a new project: `node ds-manager.js startproject`.

When the manager ask you for the modules that it will use write: webapp.

Execute `node ./ds-manager.js app -pull`.

In the DragonExample directory inner your project directory create two files: __https.ts__ and __urls.ts__.

### Project structure

      DragonExample
      |_ds_modules
      |   |_ interfaces.ts
      |   |_ webapp
      |_DragonExample
          |_urls.ts
          |_https.ts

### https.ts
    
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

A urls functions is needed declared in any place of project, but is a good practice create a file called __urls.ts__ to create this function.

    // This module manages urls.
    import Router from '../ds_modules/webapp/router';
    import helloWorld from './views';

    const urls = () => {
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

Http responses are contained in the class Http. You can import this class by this way: `import Http from
'../ds_modules/webapp/http';`.

Http class contains next static methods:

__plainTextResponse(str: string)__: recibe a string and returns a simple string.

__JSONresponse(data: any)__: recibe a Javascript code and returns a JSON.

__htmlResponse(html: string)__: recibe a html in string and return a html.

__render(request: {}, template: string, context: {})__: recibe a request object, template is the path to template in
Google Apps Script syntax, and context, values that will rendered in the template. Return a html.

## Urls

Urls are called by this way only for confort, because in GAS (Google Apps Script) is not possible use a customs URLs, but we can emulate this by the use of GET arguments. By default DS (DragonScript) use argument __path__ to recibe the route to some resource. By example:

`this-is-a-GAS-url/exec?path=some/route`

To create a new route we need to use a __Router__ class. All routes that you create must be inner a function called __urls__, that can be declared in any place, but we recommend create a file only for this purpose. You can import a router by this way: `import Router from '../ds_modules/webapp/router';`

## Router

### Add routes

With a __Rauter__ class you can create a new routes and get an absolute path from a resource by its name.

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

__includes(filename: string)__: This function allows import html code in other html file at the momento of evaluate.

Params:
  
  - filename (string): filename.
