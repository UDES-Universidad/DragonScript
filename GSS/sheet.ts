/// <reference path="./book.ts"/>

namespace Sheet {

    type sheet_type = GoogleAppsScript.Spreadsheet.Sheet;

    export function Sheet(conn: Book.connexion, name?: string): sheet_type {
        // Trae una hoja de un SpreadSheet de Google, si no existe la crea.
        if (name) {
            let sheet = conn.getSheetByName(name);
            if (sheet) {
                return <sheet_type>sheet;
            } else {
                return conn.insertSheet(name);

            }
        } else {
            return conn.getActiveSheet();
        }
    }


    export function getSheet(id_book?: string, name_sheet?: string): sheet_type {
        // Trae una hoja de un libro. Adiferencia de la función Sheet, esta
        // función ejecuta también la conexión con el libro.
        let conn = Book.conn(id_book);
        let sheet = Sheet(conn, name_sheet);
        return sheet;
    }


    export function create_table(sheet: sheet_type, headers: string[], row_start: number, col_start: number) {
        // Aquí deberán ir todas las cosas para crear una tabla,
        // de entrada inserta los encabezados de las columnas.
        let range = sheet.getRange(row_start, col_start, 1, headers.length);
        range.setFontWeight("bold");
        range.setValues([headers]);
    }


    export function rangeDataValues(sheet: sheet_type, no_header: boolean = true, data_starts_at: number = 1) {
        // regresa los valores de la hoja de cálculo.
        let values = sheet.getDataRange().getValues();
        if (no_header) {
            for (let i = 0; i < data_starts_at; i++) {
                values.shift();
            }
        }
        return values;
    }


    export function col_as_array(sheet: sheet_type, col: number, no_header = true, _trim: boolean = true) {
        // regresa una columna como un array unidimensional.
        let values = sheet.getDataRange().getValues();
        if (no_header) {
            values.shift();
        }
        let list = []
        for (const value of values) {
            let col_val = _trim ? String(value[col]).trim() : value[col];
            list.push(col_val);
        }

        return list;
    }


}