/// <reference path="./Settings.ts"/>
/// <reference path="./WebApp/Router.ts" />


type url_param = {
    queryString: string,
    parameters: {},
    parameter: {
        path: string,
    }
}

function doGet(e: url_param): any {
    // Sirve las páginas.
    CONTEXT['path'] = e.parameter.path
    let path = ROUTER.Router(e);
    let output = path[1](e);
    return output;
}

function doPost(e: url_param): any {
    // Sirve las páginas.
    CONTEXT['path'] = e.parameter.path
    let path = ROUTER.Router(e);
    let output = path[1](e);
    return output;
}


function include(filename: string) {
    // Permite incluir HTML
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function include_and_replace(filename: string, datas: {}, fn?: Function) {
    let html = include(filename);

    for (const data in datas) {
        let rex = new RegExp(`##${data}##`)
        html = html.replace(rex, datas[data])
    }

    if (fn) {
        let extra_data = fn();
        for (const datax in extra_data) {
            let rex = new RegExp(`##${datax}##`)
            html = html.replace(rex, extra_data[datax])
        }
    }

    return html;
}


function urlApp(path?: string) {
    // Obtiene la URL de la app según sea el modo de DEBUG.
    let url = ''
    if (SETTINGS.DEBUG) {
        url = SETTINGS.URL_DEV;
    } else {
        url = SETTINGS.URL_PROD;
    }

    return path ? `${url}?path=${path}` : url;
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
