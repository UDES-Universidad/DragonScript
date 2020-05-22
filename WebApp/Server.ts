/// <reference path="./Settings.ts"/>
/// <reference path="Router.ts" />


type url_param = {
    parameter: {
        path: string,
        ssid: string,
        crid: string,
    }
}

function doGet(e: url_param): any {
    // Sirve las páginas.

    let path = ROUTER.Router(e);
    path[2](e);

    // get_classroom_students(e.parameter.crid, e.parameter.ssid);

    let output = HtmlService.createTemplateFromFile(path[1]).evaluate();
    output.setTitle(SETTINGS.APP_NAME).addMetaTag('viewport', 'width=device-width, initial-scale=1');
    output.setFaviconUrl(SETTINGS.FAVICON);
    return output;
}


function include(filename: string) {
    // Permite incluir HTML
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function urlApp() {
    // Obtiene la URL de la app según sea el modo de DEBUG.
    if (SETTINGS.DEBUG) {
        return SETTINGS.URL_DEV;
    } else {
        return SETTINGS.URL_PROD;
    }
}

// Contexto de la aplicación.
let CONTEXT = {
    error: '',
    user_email: '',
    form_sheet: '',
    form_app: '',
}


function set_data_context(key: string, value: any) {
    CONTEXT[key] = value ? value : '';
    return CONTEXT;
}
