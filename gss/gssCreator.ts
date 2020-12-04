import CreatorApp from '../interfaces';

class GssCreator implements CreatorApp {
  private _app?: GoogleAppsScript.Spreadsheet.Spreadsheet;

  private _sheet?: GoogleAppsScript.Spreadsheet.Sheet;

  private _columnsMap = {};

  private _columns = [];

  public get app(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    return <GoogleAppsScript.Spreadsheet.Spreadsheet> this._app;
  }

  public get url(): string {
    return <string> this._app?.getUrl();
  }

  public get id(): string {
    return <string> this._app?.getId();
  }

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
  public setSheet(sheetName: string): void {
    const sheetNames = this.sheetNames();
    if (sheetNames.indexOf(sheetName) > 0) {
      this._sheet = <GoogleAppsScript.Spreadsheet.Sheet>
        this._app?.getSheetByName(sheetName);
    } else {
      this._sheet = this._app?.insertSheet(sheetName);
    }
  }

  /**
   * Get and array of strings with the names of sheets.
   * */
  public sheetNames(): string[] {
    if (this._app) return this._app?.getSheets().map((sheet) => sheet.getName());
    throw new Error('There is not assigned SpreadsheetApp.Spreadsheet in _app. Fn: CreatorApp.sheetNames');
  }

  /*
   * Set a columns.
   * */
  public setColumns() {};

  /**
   * Creates a copy of document and return a GDOC object.
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
}
