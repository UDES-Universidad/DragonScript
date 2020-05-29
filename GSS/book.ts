namespace BOOK {

    export type connexion = GoogleAppsScript.Spreadsheet.Spreadsheet;

    /**
     * Se conecta a un libro de cálculo.
     * @param id : ID o URL de un libro.
     */
    export function conn(id_url?: string): connexion {
        // Se conecta a una SpreadSheet de Google.
        if (id_url) {
            if (id_url.indexOf('https://docs.google.com/spreadsheets/') >= 0) {
                return SpreadsheetApp.openByUrl(id_url);
            } else {
                return SpreadsheetApp.openById(id_url);
            }
        } else {
            return SpreadsheetApp.getActiveSpreadsheet();
        }
    }


    /**
     * Regresa el nombre de las hojas de cálculo
     * dentro del libro de cálculo.
     * @param conn : Conexión.
     */
    export function NameSheets(conn: connexion) {
        //Regresa los nombres de las hojas dentro del libro.
        let sheets = conn.getSheets();
        let names = [];
        for (const sheet of sheets) {
            names.push(sheet.getName());
        }

        return names;
    }


    /**
     * Inserta una hoja de cálculo, si ya existe la hoja
     * la regresa.
     * @param conn : Conexión a un libro de cálculo.
     * @param name : Nombre de la nueva hoja.
     */
    export function insertSheet(conn: connexion, name: string) {
        try {
            return conn.insertSheet(name);

        } catch (error) {
            return conn.getSheetByName(name);
        }
    }

}