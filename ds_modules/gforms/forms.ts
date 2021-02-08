/**
 * Form creator.
 * */

class GformCreator {
  private _app: GoogleAppsScript.Forms.Form;
  
  constructor(urlOrId?: string) {
    this._connect(urlOrId || '')
  }

  get id():string {
    return this._app.getId();
  }

  get urlEdit(): string {
    return this._app.getEditUrl();
  }

  get App (): GoogleAppsScript.Forms.Form {
    return this._app;
  }

  /**
   * Connects to the application.
   * @param urlOrId (string): URL or id or nothing to
   * connect to the active form.
   * */
  private _connect(urlOrId?: string) {
    if (urlOrId && urlOrId.includes('google.com')) {
      this._app = FormApp.openByUrl(urlOrId);
    } else if (urlOrId && urlOrId?.length > 0) {
      this._app = FormApp.openById(urlOrId);
    } else if (!urlOrId) {
      this._app = FormApp.getActiveForm();
    }
  }

  /**
   * Gets information about questions.
   * */
  public itemsInfo() {
    // Get questions.
    const items = this._app.getItems();
    const questions = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      questions.push({
        type: item.getType(),
        id: String(item.getId()),
        index: String(item.getIndex()),
        title: item.getTitle(),
        helpText: item.getHelpText(),
        item: item,
      });
    }
    return questions;
  }
  
  /**
   * Get form items by type
   * */
  public getItemByType(itemType: GoogleAppsScript.Forms.ItemType) {
    const itemsInfo = this.itemsInfo();
    return itemsInfo.filter((i) => i.type == itemType);
  }

  /**
   * Get a item by a substring 
   * */
  public getItemBySubString(substring: string, property: 'title' | 'helpText') { 
    const itemsInfo = this.itemsInfo();
    return itemsInfo.filter((i) => i[property].includes(substring));
  }
}


export default const GformClient = (urlOrId: string): GformCreator => {
  return new GformCreator(urlOrId);
}
