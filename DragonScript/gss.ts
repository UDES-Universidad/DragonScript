namespace GSS {

    interface SSheet {
        // Vars
        id?: string,
        sheets: any;
        sheet_active: GoogleAppsScript.Spreadsheet.Sheet | undefined;
        sheet_name?: string;
        ss: GoogleAppsScript.Spreadsheet.Spreadsheet | undefined;
        url: string;

        // Functions
        copy: (name: string, usethis: boolean) => string | undefined;
        getSS: () => void;
        insertSheet: (nameSheet: string, usethis: boolean) => number | boolean
        setSheet: (sheet?: string | number) => void;
        values: () => object | boolean;
    }


    export class SS implements SSheet {
        id?: string = '';
        ss: GoogleAppsScript.Spreadsheet.Spreadsheet | undefined = undefined;
        url: string = '';
        sheets: any = [];
        sheet_active: GoogleAppsScript.Spreadsheet.Sheet | undefined = undefined;
        sheet_name?: string = '';


        constructor() {
            this.getSS()
        }


        copy(name: string, usethis: boolean = true): string | undefined {
            // Makes a document copy
            // If usethis is true change all attribute values to new document's values
            // usethis is seted as true by default
            try {
                if (this.id) {
                    let file: GoogleAppsScript.Drive.File = DriveApp.getFileById(this.id);
                    let nameFile: string = name ? name : "Copia de" + file.getName();
                    let newFileID: string = file.makeCopy(nameFile).getId();
                    if (usethis) {
                        this.id = newFileID;
                        this.ss = SpreadsheetApp.openById(newFileID);
                        this.url = this.ss.getUrl();
                    }
                    return newFileID;
                }
            } catch (e) {
                Logger.log(e);
                Logger.log(this.id);
            }
        }


        getSS() {
            this.ss = this.id ? SpreadsheetApp.openById(this.id) : SpreadsheetApp.getActiveSpreadsheet();
            this.id = this.ss.getId();
            this.url = this.ss.getUrl();
            this.sheets = <[]>this.ss.getSheets();
        }


        insertSheet(nameSheet: string, usethis: boolean = true) {
            // This insert new sheet_active in SS, if "usethis" is true, all values will been changed to the new sheet_active values.
            // usethis is true by default
            try {
                if (this.ss) {
                    let new_sheet: GoogleAppsScript.Spreadsheet.Sheet = this.ss.insertSheet(nameSheet);
                    if (usethis) {
                        this.setSheet(nameSheet)
                    }
                    return new_sheet.getIndex();
                }
            } catch (e) {
                Logger.log(e);
                return false;
            }
            return false;
        }


        setSheet(sheet?: string | number) {
            // Set sheet_active: get sheet_active and values from data range
            if (!sheet && this.sheet_name) {
                sheet = this.sheet_name;
            } else {
                throw ('"sheet_name" is empty.');
            }

            if (typeof sheet.valueOf() === 'string') {
                if (this.ss) {
                    let get_sheet = this.ss.getSheetByName(<string>sheet);
                    if (get_sheet) {
                        this.sheet_active = get_sheet;
                    } else {
                        this.insertSheet(this.sheet_name);
                        this.sheet_active = this.ss.getSheetByName(this.sheet_name);
                    }
                }
            } else {
                this.sheet_active = this.sheets[sheet];
            }
        }


        values(): object | boolean {
            if (this.sheet_active) {
                return this.sheet_active.getDataRange().getValues();
            } else {
                return false;
            }
        }

        // EndClass SS
    }

    // EndNameSpace
}
