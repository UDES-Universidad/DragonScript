namespace Book {

    export type connexion = GoogleAppsScript.Spreadsheet.Spreadsheet;

    export function conn(id?: string): connexion {
        // Se conecta a una SpreadSheet de Google.
        if (id) {
            if (id.indexOf('https://docs.google.com/spreadsheets/') >= 0) {
                return SpreadsheetApp.openByUrl(id);
            } else {
                return SpreadsheetApp.openById(id);
            }
        } else {
            return SpreadsheetApp.getActiveSpreadsheet();
        }
    }


    export function NameSheets(conn: connexion) {
        //Regresa los nombres de las hojas dentro del libro.
        let sheets = conn.getSheets();
        let names = [];
        for (const sheet of sheets) {
            names.push(sheet.getName());
        }

        return names;
    }

    export function insertSheet(conn: connexion, name: string) {
        // Inserta una hoja, pero a diferencia de la insersión propia de Google
        // esta exita el código de error si ya existe la hoja, si pasa esto último
        // regresa la hoja.
        try {
            return conn.insertSheet(name);

        } catch (error) {
            return conn.getSheetByName(name);
        }
    }

}