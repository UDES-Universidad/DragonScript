/**
 * This module manages the Spreadsheet.
 */

import Sheet from './sheet';

export default class GSS {
  private _app: GoogleAppsScript.Spreadsheet.Spreadsheet;

  private _sheets = new Map();

  private _urlOrId = '';

  constructor(urlOrId: string) {
    this._urlOrId = urlOrId;
    this._connect();
    this._setSheets();
  }

  public static create(urlOrId: string = ''): GSS {
    return new GSS(urlOrId);
  }

  /**
   * app represents Spreadsheet App.
   */
  public get app(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    return <GoogleAppsScript.Spreadsheet.Spreadsheet>this._app;
  }

  get url(): string {
    return <string>this._app?.getUrl();
  }

  get id(): string {
    return <string>this._app?.getId();
  }

  /**
   * Connects to Spreadsheet, if are not passed any parameter
   * the function will try to connect with the current Spreadsheet,
   * in this case, it is assumed that the script is embedded.
   * @param urlOrId (string): URL or ID Spreadsheet.
   * */
  private _connect(urlOrId?: string): GSS {
    if (urlOrId) {
      this._urlOrId = urlOrId;
      if (urlOrId.includes('google.com')) {
        this._app = SpreadsheetApp.openByUrl(urlOrId);
      } else {
        this._app = SpreadsheetApp.openById(urlOrId);
      }
    } else {
      this._app = SpreadsheetApp.getActiveSpreadsheet();
    }

    return this;
  }

  /**
   * Retrieve Sheets from Spreadsheet, and create a Sheet Object.
   * @returns GSS
   */
  private _setSheets() {
    this._app
      ?.getSheets()
      .forEach((sheet: GoogleAppsScript.Spreadsheet.Sheet) => {
        this._sheets.set(
          sheet.getName(),
          Sheet.create(this._app.getId(), sheet)
        );
      });

    return this;
  }

  /**
   * Get sheet by name.
   * @param sheetName { string } Name of sheet.
   * @returns { Sheet }
   */
  public getSheet(sheetName: string) {
    return <Sheet>this._sheets.get(sheetName);
  }

  /**
   * Get and array of strings with the names of sheets.
   * Returns an array with the sheet names.
   * */
  public sheetNames(): string[] {
    if (this._app) {
      return this._app?.getSheets().map((sheet) => sheet.getName());
    }
    throw new Error(
      'There is not assigned SpreadsheetApp.Spreadsheet in _app. Fn: CreatorApp.sheetNames'
    );
  }

  /**
   * Sets a sheet to work with it. If that sheet not exists
   * the function will try to add it.
   * @param sheetName (string): Sheet name.
   * Returns GssCreator.
   * */
  public insertSheet(sheetName: string): Sheet {
    const sheetNames = this.sheetNames();
    if (!sheetNames.includes(sheetName)) {
      const sheet = this._app.insertSheet(sheetName);
      this._sheets.set(sheetName, Sheet.create(sheet));
    }

    return this._sheets.get(sheetName);
  }

  /**
   * Creates a copy of document and return a GssCreator instance.
   * @param name (string): name to new document.
   * @param folderId: (string): folder id to save new document.
   * */
  public makeCopy(name?: string, folderId?: string): GSS {
    let driveFile: GoogleAppsScript.Drive.File;
    let newFile: GoogleAppsScript.Drive.File;
    const folder = folderId ? DriveApp.getFolderById(folderId) : null;
    const docName = name || `Copy of ${this._app?.getName()}`;
    if (this.id) {
      driveFile = DriveApp.getFileById(this.id);
      newFile = folder
        ? driveFile.makeCopy(docName, folder)
        : driveFile.makeCopy(docName);
      const newDoc = GSS.create(newFile.getId());
      return newDoc;
    }
    throw new Error('There is not an id document.');
  }

  /**
   * Sets permissions to file.
   * @param access (GoogleAppsScript.Drive.Access)
   * @param permission (GoogleAppsScript.Drive.Permission)
   * */
  public setPermissions(
    access: GoogleAppsScript.Drive.Access,
    permission: GoogleAppsScript.Drive.Permission
  ) {
    const fileFromDrive = DriveApp.getFileById(this.id);
    fileFromDrive.setSharing(access, permission);
  }
}
