import CreatorApp from '../interfaces';

/**
 * This class corresponds to Google Docs.
 * */
export default class GdocCreator implements CreatorApp {
  private _app: GoogleAppsScript.Document.Document;

  get app(): GoogleAppsScript.Document.Document {
    return this._app;
  }

  get id(): string {
    return <string> this._app.getId();
  }

  get url(): string {
    return <string> this._app.getUrl();
  }

  get body(): GoogleAppsScript.Document.Body {
    return this._app.getBody();
  }

  /**
   * Connects to the app.
   * @param urlOrId (string)
   * */
  public connect(urlOrId?: string): GdocCreator {
    if (urlOrId && urlOrId.includes('google.com')) {
      this._app = DocumentApp.openByUrl(urlOrId);
    } else if (urlOrId) {
      this._app = DocumentApp.openById(urlOrId);
    } else {
      this._app = DocumentApp.getActiveDocument();
    }
    return this;
  }

  /**
   * Creates a copy of document and return a GDOC object.
   * @param name (string): name to new document.
   * @param folderId: (string): folder id to save new document.
   * */
  public makeCopy(name?: string, folderId?: string): GdocCreator {
    let driveFile: GoogleAppsScript.Drive.File;
    let newFile: GoogleAppsScript.Drive.File;
    const folder = folderId ? DriveApp.getFolderById(folderId) : null;
    const docName = name || `Copy of ${this.app.getName()}`;
    if (this.id) {
      driveFile = DriveApp.getFileById(this.id);
      newFile = folder
        ? driveFile.makeCopy(docName, folder)
        : driveFile.makeCopy(docName);
      const newDoc = new GdocCreator(newFile.getId());
      return newDoc;
    }
    throw new Error('There is not an id document.');
  }

  /**
   * Reemplaza los marcadores de un documento. Los marcadores
   * están representados por las claves de un objeto pero
   * envueltos en hashtags ##Clave##, estas serás sustituidas
   * por el valor de la clave dentro den un objeto.
   * @param datas (object)
   * */
  public replace(datas: {}): void {
    if (Object.keys(datas).length > 0) {
      Object.entries(datas).forEach((el) => {
        this.body.replaceText(`##${el[0]}##`, String(el[1]));
      });
    }
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
