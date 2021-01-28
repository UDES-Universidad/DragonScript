# Web App Module

This module allows create an easy Web App.

## Quick start

This example uses TypeScript and [Google Clasp](https://developers.google.com/apps-script/guides/clasp).

Create a new [Google App Script standalone](https://developers.google.com/apps-script/guides/standalone).

Use DrangoScript manager to create a new project: `node manager.js startproject`.

When the manager ask you for the modules that it will use write: webapp.

Execute `node ./manager.js app -pull`.

In the DragonExample directory inner your project directory create two files: __views.ts__ and __urls.ts__.

### Project structure

      DragonExample
      |_ds_modules
      |   |_ interfaces.ts
      |   |_ webapp
      |_DragonExample
          |_urls.ts
          |_views.ts

### views.ts
    
    // This module imports Views module.
    import View from '../ds_modules/webapp/views';
      
    /**
    * This module simply render a "Hello, World!" in
    * plain text.
    */
    export default const helloWorld = (request: { parameters: {} }) => {
      return View.plainTextResponse('Hello, World!') 
    }

### urls.ts

A urls functions is needed declared in any place of project, but is a good practice create a file called __urls.ts__ to create this function.

    // This module manages urls.
    import Router from '../ds_modules/webapp/router';
    import helloWorld from './views';

    const urls = () => {
      const paths = Router();
    
      /**
       * Route to your helloWorld view.
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
 








