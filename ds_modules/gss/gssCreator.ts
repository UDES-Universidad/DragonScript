import CreatorApp from '../interfaces';
import { AbstractColumn, GenericColumn } from './gssColumnCreator';
import GssObjectsCreator from './gssObjects';

export default class GssCreator implements CreatorApp {
  private _app?: GoogleAppsScript.Spreadsheet.Spreadsheet;

  private _sheet?: GoogleAppsScript.Spreadsheet.Sheet;

  private _columnsMap = {};

  private _table: AbstractColumn[] = [];

  private _objectsModel = GssObjectsCreator;

  public get app(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    return <GoogleAppsScript.Spreadsheet.Spreadsheet> this._app;
  }

  get url(): string {
    return <string> this._app?.getUrl();
  }

  get id(): string {
    return <string> this._app?.getId();
  }

  get sheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return <GoogleAppsScript.Spreadsheet.Sheet> this._sheet;
  }

  // Builder functions
  // ------------------------------------------------------------

  /**
   * Connects to the app.
   * @param urlOrId (string)
   * */
  public connect(urlOrId?: string): GssCreator {
    if (urlOrId && urlOrId.includes('google.com')) {
      this._app = SpreadsheetApp.openByUrl(urlOrId);
    } else if (urlOrId) {
      this._app = SpreadsheetApp.openById(urlOrId);
    } else {
      this._app = SpreadsheetApp.getActiveSpreadsheet();
    }
    return this;
  }

  /**
   * Set a sheet to work with it.
   * */
  public setSheet(sheetName: string): GssCreator {
    const sheetNames = this.sheetNames();
    if (sheetNames.indexOf(sheetName) > -1) {
      this._sheet = <GoogleAppsScript.Spreadsheet.Sheet>
        this._app?.getSheetByName(sheetName);
    } else {
      this._sheet = this._app?.insertSheet(sheetName);
    }
    return this;
  }

  /*
   * Set a columns.
   * */
  public setTable(columns: AbstractColumn[]) {
    if (columns && columns.length > 0) {
      this._table = columns;
      if (this._table.length !== this._sheet.getLastColumn()) {
        throw new Error(
          'Fn:gss/gssCreator.setTable. Error: Table length not corresponds with total columns in the spreadsheet'
        );
      }
      columns.forEach((column, index) => {
        this._columnsMap[column.name] = index;
        this._columnsMap[index] = column.name;
        this._table[index].column = index;
        index++;
      });
    } else {
      Array.from(Array(this._sheet.getLastColumn()).keys())
        .forEach((index) => {
          const cell = `cell${index + 1}`;
          this._table.push(GenericColumn.create({
            name: cell,
            verboseName: this._sheet.getRange(1, index + 1).getValue(),
          }))
          this._columnsMap[cell] = index;
          this._columnsMap[index] = cell;
        });
    }
    return this;
  };

  /**
   * Get and array of strings with the names of sheets.
   * Returns an array with the sheet names.
   * */
  public sheetNames(): string[] {
    if (this._app) return this._app?.getSheets().map((sheet) => sheet.getName());
    throw new Error('There is not assigned SpreadsheetApp.Spreadsheet in _app. Fn: CreatorApp.sheetNames');
  }

  // Object functions
  // ------------------------------------------------------------

  /**
   * This method handle all about data in spreadsheet.
   * */
  public Objects(): GssObjectsCreator {
    return new this._objectsModel({
      sheet: this._sheet,
      table: this._table,
      columnsMap: this._columnsMap,
    })
  }

  // Inherited functions
  // ------------------------------------------------------------

  /**
   * Creates a copy of document and return a GssCreator instance.
   * @param name (string): name to new document.
   * @param folderId: (string): folder id to save new document.
   * */
  public makeCopy(name?: string, folderId?: string): GssCreator {
    let driveFile: GoogleAppsScript.Drive.File;
    let newFile: GoogleAppsScript.Drive.File;
    const folder = folderId ? DriveApp.getFolderById(folderId) : null;
    const docName = name || `Copy of ${this._app?.getName()}`;
    if (this.id) {
      driveFile = DriveApp.getFileById(this.id);
      newFile = folder
        ? driveFile.makeCopy(docName, folder)
        : driveFile.makeCopy(docName);
      const newDoc = new GssCreator(newFile.getId());
      return newDoc;
    }
    throw new Error('There is not an id document.');
  }

  /**
   * Sets permissions to file.
   * @param access (GoogleAppsScript.Drive.Access)
   * @param permission (GoogleAppsScript.Drive.Permission)
   * */
  public setPermissions(access: GoogleAppsScript.Drive.Access,
    permission: GoogleAppsScript.Drive.Permission) {
    const fileFromDrive = DriveApp.getFileById(this.id);
    fileFromDrive.setSharing(access, permission);
  }
  // Other functions
  // ------------------------------------------------------------
}
