/*
 * Manage Script Properties.
 * */

interface ssScriptPropsInterface {
  name: string;
  range?: number[];
}

interface setPropsByPositionInter {
  names: string[];
  startRow: number;
  column: number,
}

export default class SscriptPropsFromSheet {
  private _sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor (sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    this._sheet = sheet;
  }
  
  /*
   * Sets props by position in Sheet.
   * */
  public setPropsByPosition(conf: setPropsByPositionInter) {
    let row = conf.startRow;
    for (const name of conf.names) {
      const value = this._sheet.getRange(
        row, conf.column
      ).getValue();
      ScriptProperties.setProperty(
        name,
        JSON.stringify(value),
      );
      row += 1;
    }
  }
  
  /*
   * Set a prop.
   * */
  public setProp = (conf:ssScriptPropsInterface) {
    const range = this._sheet.getRange(...conf.range);
    let values;
    if (conf.range?.length === 2) values = range?.getValue();
    if (conf.range?.length === 4) values = range?.getValues();
    ScriptProperties.setProperty(
      conf.name,
      JSON.stringify(values),
    );
  }
}
