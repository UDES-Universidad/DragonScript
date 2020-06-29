/// <reference path="../Tables/Model.ts" />

/**
 * Modelo del formulario
 */
namespace FORM {

    // TYPES >>>

    /**Datos que debe contener una columna. */
    type col = {
        name: string,
        data_type: string,
        col: string,
        verbose_name?: string,
        default?: any,
        // Choices [any, any ...]
        choices?: {},
        max?: number,
        min?: number,
        auto_add?: any,
    }

    /**Datos que debe contener un campo. */
    type field = {
        name: string,
        label_text: string,
        attrs: {},
        choices?: {},
        make: any,
        required: boolean,
        use: boolean
    }

    // TYPES <<<

    /**Modelo base del formulario. */
    export class Form {

        /**
         * Columnas de las tabla.
         */
        cols: col[] = [];
        /**
         * Columnas mapeadas según su nombre e índice.
         */
        cols_map = {}
        /**
         * Campos a usar. Los nombres de los campos (name) deben ser
         * iguales a los nombres de las columnas.
         */
        fields_data: field[] = [];
        /**
         *  Campos en hTML = { field_name: {label:string, field:string_html}}.
         * */
        fields: {} = {};
        /**
         * Hace referencia a los datos de una fila como
         * los devuelve SHEET.BASE_MODEL.datas
         */
        datas: {} = {};


        /**
         * Hace un mapa de las columnas {name: index, index: name ...}
         */
        map_table() {
            if (!this.cols) {
                throw "The attribute cols is empty.";
            }
            let cols_map = {}
            for (let i = 0; i < this.cols.length; i++) {
                let name = this.cols[i].name;
                cols_map[name] = i;
                cols_map[`${i}`] = name;
            }

            this.cols_map = cols_map;
            return cols_map;
        }

        /**
         * Crea un conjunto de Label y field en el atributo
         * fields = { nombre_de_la_columna: {label: string, field: string}, ...}
         */
        fields_collector(datas: {}) {
            this.map_table();
            for (const field of this.fields_data) {
                let col_index = this.cols_map[field.name];
                let col = this.cols[col_index]
                if (datas) {
                    this.datas = datas;
                    field.attrs['value'] = this.datas[field.name];
                }
                this.fields[field.name] = field.make(field, col);
            }

            return this.fields;
        }


        /**
         * Regresa el formulario en párrafos
         */
        as_p() {
            if (this.fields) {
                let body_form = '';
                for (const key in this.fields) {
                    body_form += `<p>${this.fields[key].label} ${this.fields[key].field}</p>`
                }
                return body_form;
            } else {
                throw "Before execcute as_p function execute fields_collector";
            }
        }

        /**
         * Regresa el formulario como Tabla
         * @param attrs : attributos para la tabla
         */
        as_table(attrs?: {}) {
            let body_form = '<table';

            for (const attr in attrs) {
                body_form += ` ${attr}="${attrs[attr]}"`;
            }
            body_form += '>'

            for (const key in this.fields) {
                body_form += `
                <tr>
                    <th>${this.fields[key].label}</th>
                    <th>${this.fields[key].field}</th>
                </tr>
                `
                body_form += '</table>';
            }

            return body_form;
        }





    }

}