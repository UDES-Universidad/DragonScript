/// <reference path="../Settings.ts" />

class GdocBuilder {
  private _book: string;
  private _sheet: string;
  private _sheetName: string;

  public setBook(book: string) {
    if (book.includes('')) {
      
    }
  }

  public setSheet() {

  } 
  
  public connect() {
  
  }
}


namespace DOCS {

  /**
   *Se conecta a un documento.
   * @param url_id URL o ID de un documento de Google,
   * si está vacío indica que se deberá conectar al
   * documento activo.
   */
  export function conn(url_id: string = ''): GoogleAppsScript.Document.Document {
    if (url_id) {
      if (url_id.indexOf('https://docs.google.com/document/') >= 0) {
        return DocumentApp.openByUrl(url_id);
      } else {
        return DocumentApp.openById(url_id);
      }
    }
    return DocumentApp.getActiveDocument();
  }



}
