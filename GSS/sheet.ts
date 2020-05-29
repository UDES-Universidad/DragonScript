/// <reference path="./book.ts"/>

namespace SHEET {

    type sheet_type = GoogleAppsScript.Spreadsheet.Sheet;


    /**
     * Se conecta a una hoja de un libro.
     * @param conn : Conexión a un libro.
     * @param name : Nombre de la hoja.
     */
    export function Sheet(conn: BOOK.connexion, name?: string): sheet_type {
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


    /**
     * Se conceta a una hoja de cálculo,
     * si la hoja no existe la crea.
     * @param id_book : ID o URL de un libro de cálculo.
     * @param name_sheet : Nombre de una hoja de cálculo.
     */
    export function getSheet(id_book?: string, name_sheet?: string): sheet_type {
        // Trae una hoja de un libro. Adiferencia de la función Sheet, esta
        // función ejecuta también la conexión con el libro.
        let conn = Book.conn(id_book);
        let sheet = Sheet(conn, name_sheet);
        return sheet;
    }


    /**
     * Crea una tabla
     * @param sheet : Hoja de cálculo.
     * @param headers : Encabezados de la tabla.
     * @param row_start : En qué fila comienzan los encabezados.
     * @param col_start : En qué columna comienzan los encabezados.
     */
    export function create_table(sheet: sheet_type, headers: string[], row_start: number, col_start: number) {
        // Aquí deberán ir todas las cosas para crear una tabla,
        // de entrada inserta los encabezados de las columnas.
        let range = sheet.getRange(row_start, col_start, 1, headers.length);
        range.setFontWeight("bold");
        range.setValues([headers]);
    }


    /**
     * Obtiene los valores del rango de Datos.
     * @param sheet : Hoja de cálculo.
     * @param no_header : true si se quieren quitar los encabezados, por default true.
     * @param data_starts_at : Fila en la que comienzan los datos.
     */
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


    /**
     * Regresa una columna como un array.
     * @param sheet : Hoja de cálculo
     * @param col : Columna que se va a combertir en array simple.
     * @param no_header : Si se van a quitar o no los encabezados.
     * @param _trim : Si se van a quitar los espacios extras.
     */
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