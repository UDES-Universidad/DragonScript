namespace VIEWS {

    type url_param = {
        parameter: {
            path: string,
            // ID de la hoja de cálculo.
            ssid: string,
            // ID del final de la URL del Classroom.
            crid: string,
        }
    }

    export function IndexView(e: url_param) {

        if (e.parameter.ssid) {
            set_data_context('ssid', e.parameter.ssid);
        }

        if (e.parameter.crid) {
            set_data_context('crid', e.parameter.crid);
        }

    }

}