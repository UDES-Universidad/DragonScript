import SscriptPropsFromSheet from './sscriptprops';

/**
 * ScriptProps Client
 * */
export default class ScriptPropsClient {
  public static ssScriptProps(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    return new SscriptPropsFromSheet(sheet);
  }

  public static getProp(name: string) {
    const data = ScriptProperties.getProperty(name);
    return data ? JSON.parse(data) : null;
  }

  public static setProp(name: string, value: any) {
    ScriptProperties.setProperty(name, JSON.stringify(value));
  }

  public static setProps(data: {}) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        ScriptPropsClient.setProp(key, value);
      }
    }
  }

  public static getProps() {
    const keys = ScriptProperties.getKeys();
    const obj = {};
    keys.forEach((key: string) => {
      obj[key] = ScriptPropsClient.getProp(key);
    });
    return obj;
  }
}
