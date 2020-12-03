export default interface CreatorApp {
  app: any;
  id: string;
  url: string;
  connect(urlOrId?: string): any;
  makeCopy(name?: string, folderId?: string): any;
  setPermissions(access: GoogleAppsScript.Drive.Access,
    permission: GoogleAppsScript.Drive.Permission): void;

  // Optionals
  replace?(datas: {}): void;
}
