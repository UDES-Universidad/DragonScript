import CreatorApp from '../interfaces';

// Interfaces
interface ConfExportDoc {
  mimeType: string;
  name: string;
  folderId?: string;
  onlyBlob?: boolean;
  accessType?: GoogleAppsScript.Drive.Access;
  permissionType?: GoogleAppsScript.Drive.Permission;
}


/**
 * This class corresponds to Google Docs.
 * */
export default class GdocCreator implements CreatorApp {
  private _app?: GoogleAppsScript.Document.Document;

  public marks: string = '##';

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
      const newDoc = new GdocCreator();
      newDoc.connect(newFile.getId());
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
  public replace(datas: {}, forceWrite: boolean = false): void {
    const entries = Object.entries(datas);
    const body = this._app.getBody();
    for (const el of entries) {
      const key = `${this._marks}${el[0]}${this._marks}`;
      body.replaceText(key, String(el[1]));
    }
    if (forceWrite) {
      const id = this._app?.getId();
      this._app?.saveAndClose();
      this.connect(id);
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

  /**
   * Expots a document according to its MIME type.
   * Returns a blob if onlyBlob is setted to true.
   * If folderId contains an id, this method returns
   * a File instance.
   * @param conf (ConfExportDoc) contains:
   * @param mimeType: string;
   * @param name: string;
   * @param folderId?: string;
   * @param onlyBlob?: boolean;
   * @param accessType: GoogleAppsScript.Drive.Access;
   * @param permissionType: GoogleAppsScript.Drive.Permission;
   * */
  public exportDoc(conf: ConfExportDoc) {
    const blob = DriveApp.getFileById(this.id)
      .getAs(conf.mimeType);
    blob.setName(conf.name);
    if ('onlyBlob' in conf && conf.onlyBlob) return blob;
    let folder;
    if ('folderId' in conf && conf.folderId) {
      folder = DriveApp.getFolderById(conf.folderId);
      const newDoc = folder.createFile(blob);
      if ('accessType' in conf
        && conf.accessType
        && 'permissionType' in conf
        && conf.permissionType) {
        newDoc.setSharing(conf.accessType, conf.permissionType);
      }
      return newDoc;
    }

    return false;
  }

  /**
   * Send file to trash.
   * */
  public setTrashed(trashed: boolean) {
    DriveApp.getFileById(this._app?.getId()).setTrashed(trashed);
  }
}


