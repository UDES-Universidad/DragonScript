/// <reference path="./Views.ts" />


namespace URL_PATHS {

    type path = [string, string, Function];

    /**
     * Número de path por default
     */
    export const deafult_path = 0;

    /**
     * Contiene las URLs a donde será redireccionado el usuario.
     * ['Patrón', 'Plantilla', Función a ejecutar al encontrar el patrón]
     */
    export let url_patterns: path[] = [
        ['', 'templates/index', VIEWS.IndexView],
    ];

}
