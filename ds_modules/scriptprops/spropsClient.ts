import { ScriptProps, ScriptPropsFromSheet } from './sscriptprops';

/**
 * ScriptProps Client
 * */
export default class ScriptPropsClient {
  public static ssScriptProps(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    return new ScriptPropsFromSheet(sheet);
  }

  public static props() {
    return new ScriptProps();
  }
}
