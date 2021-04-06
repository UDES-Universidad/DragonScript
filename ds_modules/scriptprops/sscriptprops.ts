/*
 * Manage Script Properties.
 * */

/*
 ************************************************************
 ************* ScriptProps **********************************
 ************************************************************
 * */


/**
 * Handles ScriptProperties.
 * All values are converted to string before to be saved regardless of the type they originally have.
 * The values returned by retrieve functions are previously parsed by JSON.parse.
 * */
class ScriptProps {
  private _propsService?: GoogleAppsScript.Properties.ScriptProperties;

  constructor() {
    this._getService();
  }

  /**
   * Get keys.
   * */
  public get keys(): string[] {
    return <string[]>this._propsService?.getKeys() || [];
  }

  /**
   * Gets the service.
   * */
  private _getService() {
    this._propsService = PropertiesService.getScriptProperties();
  }

  /**
   * Get only a prop.
   * @param key (string): prop name.
   * @param value (any): prop value.
   * */
  public setProp(key: string, value: any) {
    this._propsService?.setProperty(key, JSON.stringify(value));
  }

  /**
   * Sets many props at the same time. All values are converted
   * to string type before to be saved.
   * @param props ({ [keys: string]: string; }): a set of pair key / values.
   * */
  public setMany(props: { [keys: string]: string } = {}) {
    const propsArr = Object.entries(props);
    if (propsArr.length > 0) {
      propsArr.forEach((item: [string, any]) => {
        this.setProp(item[0], item[1]);
      });
    }
  }

  /**
   * Gets a prop.
   * @param key (string): prop's name.
   * */
  public getProp(key: string) {
    const prop: string = this._propsService?.getProperty(key);
    if (prop) {
      return JSON.parse(prop);
    }
    return '';
  }

  /**
   * Retrieve all props.
   * */
  public getAll() {
    const props = this._propsService?.getProperties() || {};
    const propsArr = Object.entries(props);
    const propsParsed: { [keys: string]: string } = {};
    if (propsArr.length > 0) {
      propsArr.forEach((item: [string, any]) => {
        propsParsed[item[0]] = JSON.parse(item[1]);
      });
    }

    return propsParsed;
  }

  /**
   * Delete a prop.
   * @param key (string): prop's name.
   * */
  public deleteProp(key: string) {
    this._propsService?.deleteProperty(key);
  }

  /**
   * Delete all props.
   * */
  public deleteAll() {
    this._propsService?.deleteAllProperties();
  }
}

/*
 ************************************************************
 ************* ScriptPropsFromSheet *************************
 ************************************************************
 * */

interface ssScriptPropsInterface {
  name: string;
  range?: number[];
}

interface setPropsByPositionInter {
  names: string[];
  startRow: number;
  column: number;
}
/**
 *
 * */
class ScriptPropsFromSheet extends ScriptProps {
  private _sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    super();
    this._sheet = sheet;
  }

  /*
   * Sets props by position in Sheet.
   * */
  public setPropsByPosition(conf: setPropsByPositionInter) {
    let row = conf.startRow;
    for (const name of conf.names) {
      const value = this._sheet.getRange(row, conf.column).getValue();
      this.setProp(name, value);
      row += 1;
    }
  }

  /*
   * Set a prop.
   * */
  public setPropFromRange = (conf:ssScriptPropsInterface) {
    const range = this._sheet.getRange(...conf.range);
    let values;
    if (conf.range?.length === 2) values = range?.getValue();
    if (conf.range?.length === 4) values = range?.getValues();
    this.setProp(conf.name, values);
  }
}

export default {
  ScriptProps,
  ScriptPropsFromSheet,
};
