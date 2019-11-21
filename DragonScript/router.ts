namespace ROUTER {

    export function url_get_parser(url_get_parser_param_type: {}): [] {
        let params: string[] = Object.keys(url_get_parser_param_type.parameter);

        let url_arr = []

        for (let param of params) {
            if (param === 'pag') {
                if (params.indexOf('/') >= 0) {
                    url_arr = params.pag.split('/');
                } else {
                    url_arr.push(params.pag)
                }
                break;
            }
        }

        return url_arr;
    }

}
