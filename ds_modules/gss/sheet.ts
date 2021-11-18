/**
 * This module manages Sheet methods and properties.
 */

import { RangeSheet } from './range';

import { AbstractColumn } from './columns/abstract_column';

export default class Sheet {
  private _ssid: string = '';

  private _sheetName: string = '';

  private _sheet?: GoogleAppsScript.Spreadsheet.Sheet;

  private _ranges: { [key: string]: Range } = {};

  constructor(ssid: string, sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    this._sheet = sheet;
    this._ssid = ssid;
    this._sheetName = this._sheet.getName();
  }

  public static create(
    ssid: string,
    sheet: GoogleAppsScript.Spreadsheet.Sheet
  ) {
    return new Sheet(ssid, sheet);
  }

  /**
   * @return { GoogleAppsScript.Spreadsheet.Sheet }
   */
  get sheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return <GoogleAppsScript.Spreadsheet.Sheet>this._sheet;
  }

  /**
   * Ad new range to Sheet. Ranges manages the CRUD in its range.
   * @param conf
   */
  public addRange(conf: {
    name: string;
    columns: AbstractColumn[];
    range?: number[];
  }) {
    const lastRow = this._sheet?.getLastRow();

    const lastColumn = this._sheet?.getLastColumn();

    const range =
      'range' in conf && conf.range ? conf.range : [1, 1, lastRow, lastColumn];

    if (range.length === 1) {
      range.push(1, lastRow, lastColumn);
    } else if (range.length === 2) {
      range.push(lastRow, lastColumn);
    } else if (range.length === 3) {
      range.push(lastColumn);
    }

    const columns = conf.columns;

    // TODO: Add dynamic columns

    // if ('columns' in conf && conf.columns.length > 0) {
    //   columns = conf.columns;
    // } else {
    //   columns = this._addGenericColumns([], lastColumn, hasHeaders);
    // }

    const rangeConf = {
      ...conf,
      columns: columns,
      range: range,
      ssid: this._ssid,
      sheetName: this._sheetName,
    };

    const newRange = RangeSheet.create(rangeConf);
    this._ranges[conf.name] = newRange;

    return newRange;
  }

  /**
   * Return a range by its name.
   * @param name { string } range name.
   * @returns { Range }
   */
  public getRange(name: string): Range {
    return this._ranges[name];
  }
}
