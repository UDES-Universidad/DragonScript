/// <reference path="gss.ts" />
/// <reference path="date.ts"/>

namespace ORM {

    type column = {
        // colum?: number,
        data_type: string,
        default?: any,
        index_col?: number,
        name: string;
        verbose_name?: string,
    }

    interface Model_table {
        // Vars
        // sheet_name: string;
        columns: column[];
        columns_directory: {};
        column_headers: string[];
        column_headers_verbose: string[];

        //Functions
        all: (header?: string) => {} | [];
        create_columns_directory: () => void;
        get: (param: any, column: string | number) => object | undefined;
        get_headers: () => void;
        // get_colum_data_by_name: (name: string) => object;
        dataTypeSetter: (data: any, index: number, save?: boolean) => any;
        filter: (param: any, column: string | number, header?: string) => object;
        save: (data: object) => boolean;
        table_constructor: () => void;
        unzip: (obj: object) => object;
        zip: (values: any[]) => object;
        colToArr: (col: number, deleteHeader: boolean, uniques: boolean) => object;
        objByHeader: (header: string, datas: []) => object;
    }

    export abstract class Model extends GSS.SS implements Model_table {

        // sheet_name: string;
        columns: column[] = [];
        columns_directory: {} = {};
        column_headers: string[] = [];
        column_headers_verbose: string[] = [];

        constructor() {
            super();
            // this.table_constructor()
            // this.create_columns_directory();
        }


        table_constructor(): void {
            // Add new table if not exists, and add headers.
            Logger.log(this.id);
            Logger.log(this.sheet_name);
            if (this.sheet_name && this.id) {
                this.getSS();
                let existSheet: boolean = false;
                for (let sheet of this.sheets) {
                    if (this.sheet_name === sheet.getName()) {
                        existSheet = true;
                        break;
                    }
                }

                if (!existSheet) {
                    this.insertSheet(this.sheet_name, false);
                }

                this.setSheet(this.sheet_name);
                this.get_headers();
                if (this.sheet_active) {
                    this.sheet_active.getRange(1, 1, 1, this.column_headers_verbose.length).setValues([this.column_headers_verbose]);
                } else {
                    throw new Error('There are not an Active Sheet.');
                }
            } else {
                throw new Error('Add sheet_name and id in SS');
            }

            this.create_columns_directory();
            this.setSheet()
        }


        create_columns_directory() {
            // Crea un directorio, el cual es un objeto: "nombre de la columna: indice".
            // Tambien agrega el indice de cada columna en la hoja de calculo
            if (this.columns) {
                this.columns.forEach(
                    (value, index) => {
                        this.columns_directory[value.name] = index;
                        value.index_col = index + 1;
                    }
                );
            }
        }


        dataTypeSetter(data: any, index: number, save?: boolean) {
            // Esta función transforma el string recuperado de la hoja de cálculo a un dato según su column
            let type = this.columns[index].data_type;
            if (type === 'string') {
                return String(data);
            } else if (type === 'number') {
                return Number(data);
            } else if (type === 'date') {
                if (save) {
                    return Utilities.formatDate(data, "America/Mexico_City", "dd/MM/yyyy");
                } else {
                    return data;
                }
            } else if (type === 'datetime') {
                if (save) {
                    return Utilities.formatDate(data, "America/Mexico_City", "dd/MM/yyyy HH:mm:ss");
                } else {
                    return data;
                }
            } else if (type === 'time') {
                return undefined;
            } else if (type === 'json') {
                if (save) {
                    return JSON.stringify(data);
                } else {
                    try {
                        return JSON.parse(data);
                    } catch {
                        return data;
                    }
                }
            } else if (type === 'boolean') {
                return data;
            }

            // return date;
        }


        get_headers(): void {
            // Get headers from column array
            for (let col of this.columns) {
                let header_verbose: string;
                if (col.verbose_name) {
                    header_verbose = col.verbose_name
                } else {
                    header_verbose = col.name
                }
                this.column_headers_verbose.push(header_verbose)
                this.column_headers.push(col.name)
            }
        }


        get(param: any, column: string | number): object | undefined {
            // Regresa una fila de un dato conocido
            let values: any[] = this.values();
            let column_index: number;
            if (typeof column.valueOf() === 'string') {
                column_index = this.columns_directory[column];
            } else {
                column_index = <number>column;
            }

            for (let i = 0; i < values.length; i++) {
                let value = values[i];
                if (this.dataTypeSetter(value[column_index], column_index) === this.dataTypeSetter(param, column_index)) {
                    let val_ziped = this.zip(value)
                    val_ziped['row'] = i + 1;
                    return val_ziped;
                }
            }

        }


        filter(param: any, column: string | number, header?: string) {
            // Un conjunto de datos que coinciden con la busqueda en una columna
            let values_filtered: any[] = []
            let values: any[] = this.values();
            let column_index: number;
            if (typeof column.valueOf() === 'string') {
                if (this.columns_directory.hasOwnProperty(column)) {
                    column_index = this.columns_directory[column];
                } else {
                    throw ('El header o nombre de columna al que se intenta acceder no existe.')
                }
            } else {
                column_index = <number>column;
            }

            values.forEach((value, index) => {
                if (this.dataTypeSetter(value[column_index], column_index) === this.dataTypeSetter(param, column_index)) {
                    let val_ziped = this.zip(value)
                    val_ziped['row'] = index + 1;
                    values_filtered.push(val_ziped);
                }
            });

            if (header) {
                let asObj: object = this.objByHeader(header, <[]>values_filtered);
                return asObj;
            }

            return values_filtered;
        }


        all(header?: string) {
            let values_obj: object[] = []
            let values: any[] = this.values();

            values.forEach((value, index) => {
                let val_ziped = this.zip(value)
                val_ziped['row'] = index + 1;
                values_obj.push(val_ziped);
            });

            values_obj.shift()
            if (header) {
                let asObj: object = this.objByHeader(header, <[]>values_obj);
                return asObj;
            }
            return values_obj;
        }

        save(data: object | any) {
            // WARNING: Resolver tipo any por object.
            let unziped: [] | any = this.unzip(data)
            let row: number = Number(data.row)
            try {
                if (this.sheet_active) {
                    if (row) {
                        let range: GoogleAppsScript.Spreadsheet.Range = this.sheet_active.getRange(row, 1, 1, unziped.length);
                        range.setValues([unziped]);
                    } else {
                        this.sheet_active.appendRow(unziped);
                    }
                } else {
                    throw new Error('There are not an Active Sheet.')
                }
                return true;
            } catch (e) {
                Logger.log(e);
                return false;
            }
        }

        unzip(obj: object): object {
            // Objetos a array siguiendo el orden de los headers
            let values: any[] = [];
            for (let header of this.column_headers) {
                let colum = this.columns[this.columns_directory[header]]
                if (!obj[header]) {
                    if (colum.hasOwnProperty('default')) {
                        values.push(colum.default);
                    } else {
                        values.push('');
                    }

                } else {
                    values.push(this.dataTypeSetter(obj[header], this.columns_directory[header], true));
                }
            }

            return values
        }


        zip(values: any[]): object {
            // Crea un objeto con los headers como keys.
            let obj = {};
            let keys: any[] = this.column_headers;
            keys.forEach((key, i) => {
                if (!values[i]) {
                    if (this.columns[i].hasOwnProperty('default')) {
                        if (this.columns[i].default) {
                            obj[key] = this.dataTypeSetter(this.columns[i].default, i);
                        } else {
                            obj[key] = '';
                        }
                    } else {
                        obj[key] = '';
                    }
                } else {
                    obj[key] = this.dataTypeSetter(values[i], i);
                }
            });
            return obj;
        }

        colToArr(col: number, deleteHeader: boolean, uniques: boolean): object {
            let values: [] = this.values();

            if (values) {
                if (deleteHeader) {
                    values.shift();
                }

                values = values.map(function(el) {
                    if (el[col]) {
                        return el[col];
                    }
                });

                if (uniques) {
                    values = values.filter(function(elem, index, self) {
                        if (elem) {
                            return index == self.indexOf(elem);
                        }
                    });
                }

                return values;
            }
        }

        objByHeader(header: string, datas: []): object {
            let obj = {};
            for (let data of datas) {
                obj[data[header]] = data;
            }

            return obj;
        }

    }


}
