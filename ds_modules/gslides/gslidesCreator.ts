import CreatorApp from '../interfaces';

// Interfaces

interface ReplaceConf {
  data: { [keys: string]: string };
  forceWrite: boolean;
  matchCase: boolean;
}

interface ConfExportDoc {
  mimeType: GoogleAppsScript.MimeType;
  name: string;
  folderId?: string;
  onlyBlob?: boolean;
  accessType?: GoogleAppsScript.Drive.Access;
  permissionType?: GoogleAppsScript.Drive.Permission;
  editors?: string[];
  commenters?: string[];
  viewers?: string[];
}

class GslidesCreator implements CreatorApp {
  private _app?: GoogleAppsScript.Slides.Slide;

  public marks: string = '##';

  get app(): GoogleAppsScript.Slides.Slide {
    return this._app;
  }

  get id(): string {
    return <string>this._app.getId();
  }

  get url(): string {
    return <string>this._app.getUrl();
  }

  /**
   * Connects to the app.
   * @param urlOrId (string)
   * */
  public connect(urlOrId?: string): GslidesCreator {
    if (urlOrId && urlOrId.includes('google.com')) {
      this._app = SlidesApp.openByUrl(urlOrId);
    } else if (urlOrId) {
      this._app = SlidesApp.openById(urlOrId);
    } else {
      this._app = SlidesApp.getActiveDocument();
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
      const newDoc = new GslidesCreator();
      return newDoc.connect(newFile.getId());
    }
    throw new Error('There is not an id slide document.');
  }

  /**
   * Reemplaza los marcadores de un documento. Los marcadores
   * están representados por las claves de un objeto pero
   * envueltos en hashtags ##Clave##, estas serás sustituidas
   * por el valor de la clave dentro den un objeto.
   * @param datas (object)
   * */
  public replace(conf: ReplaceConf): void {
    let forceWrite = true;
    let matchCase = true;
    if (!('data' in conf)) {
      throw new Error('Replace method needs data to work.');
    }
    if ('forceWrite' in conf) {
      forceWrite = conf.forceWrite;
    }
    if ('matchCase' in conf) {
      matchCase = conf.matchCase;
    }
    const entries = Object.entries(conf.data);
    for (const el of entries) {
      const key = `${this.marks}${el[0]}${this.marks}`;
      const newContent = String(el[1]);
      this._app?.replaceAllText(key, newContent, matchCase);
    }
    if (forceWrite) {
      this._app?.saveAndClose();
      this.connect(this.id);
    }
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

  /**
   * Exports a document according to its MIME type.
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
   * @param editors: string[];
   * @param viewers: string[];
   * @param commenters: string[];
   * */
  public exportDoc(conf: ConfExportDoc) {
    const blob = DriveApp.getFileById(this.id).getAs(conf.mimeType);
    let folder;
    blob.setName(conf.name);
    if ('onlyBlob' in conf && conf.onlyBlob) return blob;
    if ('folderId' in conf && conf.folderId) {
      folder = DriveApp.getFolderById(conf.folderId);
      const newDoc = folder.createFile(blob);
      if (
        'accessType' in conf &&
        conf.accessType &&
        'permissionType' in conf &&
        conf.permissionType
      ) {
        newDoc.setSharing(conf.accessType, conf.permissionType);
      }
      if ('commenters' in conf && conf.commenters.length > 0) {
        newDoc.addCommenters(conf.commenters);
      }
      if ('editors' in conf && conf.editors.length > 0) {
        newDoc.addEditors(conf.editors);
      }
      if ('viewers' in conf && conf.viewers.length > 0) {
        newDoc.addViewers(conf.viewers);
      }
      return newDoc;
    }

    return false;
  }

  /**
   * Send file to trash.
   * */
  public setTrashed(trashed: boolean) {
    DriveApp.getFileById(this.id).setTrashed(trashed);
  }
}

export default {
  GslidesCreator,
};
