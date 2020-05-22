namespace MODEL {

    type col = {
        name: string,
        data_type: string,
        col: string,
        verbose_name?: string,
        default?: any,
        // Choices [any, any ...]
        choices?: any[],
        max?: number,
        min?: number,
        auto_add?: any,
    }


    /**
     * Crea un objeto de un array según las columnas que se le pasen.
     */
    export class BASE_MODEL {

        // Hoja de cálculo
        sheet!: GoogleAppsScript.Spreadsheet.Sheet;
        // Fila de la que proviene la información.
        row!: number;
        // Columnas: array de objetos con información de la columna.
        cols!: col[];
        // Datos obtenidos directamente de la hoja de cálculo.
        data_raw!: any[];
        // Se almacenan los datos creados por zip.
        datas = {};

        ERRORS = {
            "TYPE_NOT_RECOGNIZED": "The type of element is not recognized",
            "MUST_BE_STRING_OR_NUMBER": "Only string or number is allowed",
            "MIN": "The value is smaller than the specified min",
            "MAX": "The value is greater than the specified max",
        }

        constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, cols: col[], data_raw: any[]) {
            if (sheet && data_raw && row && cols) {
                this.row = row;
                this.cols = cols;
                this.sheet = sheet;
                this.data_raw = data_raw
                this.zip();
            } else {
                throw "This params are required: sheet, row, cols, data_raw";
            }
        }

        /**
         * La función zip se encarga de crear un objeto key:value
         * del array simple data_raw, que son los valores obtenidos
         * directamente de la hoja de cálculo. EL objeto obtenido
         * se crea según las opciones pasadas en el array de columnas.
         */
        zip() {
            for (const col of this.cols) {
                let value = this.data_raw[col.col];
                this.datas[col.name] = value;
            }
        }

        /**
         * Guarda los valores del objeto obtenido
         * de la funcion zip en el array data_raw.
         * Este es el proceso previo a almacenamiento.
         */
        unzip() {
            for (const col of this.cols) {
                let value = this.datas[col.name];

                value = this.check_type(value, col);
                value = this.check_min(value, col);

                if (!this.datas[col.name] && col.default) {
                    value = col.default;
                }

                if (col.auto_add) {
                    value = col.auto_add;
                }

                this.data_raw[col.col] = value;
            }
        }

        /**
         * Guarda los datos en la hoja de cálculo.
         */
        save() {
            this.unzip();
            let range = this.sheet.getRange(this.row, 1, 1, this.data_raw.length);
            range.setValues([this.data_raw]);
        }

        // COMPROBACIONES >>>

        check_type(val: any, col: col) {
            if (col.data_type === 'string') {
                return String(val);
            } else if (col.data_type === 'number') {
                return Number(val);
            } else if (col.data_type === 'boolean') {
                return Boolean(val);
            } else {
                throw this.ERRORS.TYPE_NOT_RECOGNIZED + this.format_value_error(val, col, col.data_type);
            }
        }

        check_min(val: string | number, col: col) {
            if (col.hasOwnProperty('min')) {
                if (col.data_type === 'string') {
                    if (col.min > val.length) {
                        throw this.ERRORS.MIN + this.format_value_error(val, col, col.data_type, col.min);
                    }
                } else if (col.data_type === 'number') {
                    if (Number(col.min) > Number(val)) {
                        throw this.ERRORS.MIN + this.format_value_error(val, col, col.data_type, col.min);
                    }
                }
            }

            return val;
        }

        check_max(val: string | number, col: col) {
            if (col.hasOwnProperty('max')) {
                if (col.data_type === 'string') {
                    if (col.max < val.length) {
                        throw this.ERRORS.MAX + this.format_value_error(val, col, col.data_type, col.max);
                    }
                } else if (col.data_type === 'number') {
                    if (Number(col.max) < Number(val)) {
                        throw this.ERRORS.MAX + this.format_value_error(val, col, col.data_type, col.max);
                    }
                }
            }
            return val;
        }

        // COMPROBACIONES <<<

        format_value_error(val: any, col: col, data_type: string, condition?: any) {
            return ` => COL_NAME: ${col.name}, DATA_TYPE: ${data_type}, VALUE: ${val}, ${condition ? 'CONDITION:' + condition : ''}.`
        }
    }


}
