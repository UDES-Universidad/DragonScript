/// <reference path="urls.ts" />


namespace ROUTER {

    type url_param = {
        parameter: {
            path: string,
            ssid: string,
            crid: string,
        }
    }

    /**
     * Permite elegir la ruta a mostrar.
     * @param e : Request
     * @param method : Método a usar
     */
    export function Router(e: url_param, method: string = 'GET') {

        let _defualt_path = URL_PATHS.url_patterns[URL_PATHS.deafult_path];

        if (e.parameter.hasOwnProperty('path')) {
            if (e.parameter.path !== '') {
                for (const path of URL_PATHS.url_patterns) {
                    if (path[0] === e.parameter.path) {
                        return path;
                    }
                }
            }
        }

        return _defualt_path;

    }

}