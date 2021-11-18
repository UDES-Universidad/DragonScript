import { AbstractColumn } from './columns/abstract_column';

/**
 * Manages rows
 * */

import { AbstractColumn } from './columns/abstract_column';

export interface ConfParamsRow {
  ssid: string;
  sheetName: string;
  columns: AbstractColumn[];
  columnsIndex: {};
  range: number[];
  values?: any[];
}

export class Row {
  private _ssid = '';

  private _sheetName = '';

  private _columnsIndex: {} = {};

  private _columns: AbstractColumn[] = [];

  private _values: any[] = [];

  private _range: number[];

  constructor(conf: ConfParamsRow) {
    this._ssid = conf.ssid;
    this._sheetName = conf.sheetName;
    this._columnsIndex = conf.columnsIndex;
    this._columns = conf.columns;
    this._range = conf.range;

    if ('values' in conf && conf.values.length > 0) {
      this._values = conf.values;
    }
  }

  public static create(conf: ConfParamsRow): Row {
    return new Row(conf);
  }

  private _getRange(): GoogleAppsScript.Spreadsheet.Range {
    const ss = SpreadsheetApp.openById(this._ssid);
    const sheet = ss.getSheetByName(this._sheetName);
    return sheet.getRange(...this._range);
  }

  private _thereAreValues(): void {
    if (this._values.length < 1) {
      this._values = this._getRange().getValues()[0];
    }
  }

  /**
   * Gets all data in array.
   * */
  get values(): any[] {
    this._thereAreValues();

    return this._values.map((val, i) => {
      return this._columns[i].transform(val);
    });
  }

  /**
   * Sets new data.
   * @param theDatas (any[]): data to row, it must have the same
   * length of columns sheet.
   * */
  set values(theDatas: any[]) {
    if (theDatas.length === this._maxLength) this._values = theDatas;
    throw new Error('Data must have the same length of columns.');
  }

  get valuesAsObj(): { [key: string]: any } {
    const obj = {};
    this._values.forEach((val, i) => {
      const key = this._columnsIndex.get(i);
      obj[key] = val;
    });

    return obj;
  }

  /**
   * Gets the name or index of a column by his name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * */
  private getColumIndex(columnNameOrNumber: string | number): number {
    return typeof columnNameOrNumber === 'string' && columnNameOrNumber
      ? this._columnsIndex.get(columnNameOrNumber)
      : columnNameOrNumber;
  }

  /**
   * Gets value cell by his name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * */
  public get(columnNameOrNumber: string | number): any {
    this._thereAreValues();
    const columnIndex = this.getColumIndex(columnNameOrNumber);
    const column = this._columns[columnIndex];
    return column.transform(this._values[columnIndex]);
  }

  /**
   * Sets new data to cell, based on its name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * @param value (any): new value to cell.
   * */
  public set(columnNameOrNumber: string | number, value: any): void {
    const columnIndex = this.getColumIndex(columnNameOrNumber);
    this._values[columnIndex] = value;
  }

  public save(): void {
    this._getRange().setValues([this._values]);
  }

  public refresh(): void {
    this._values = this._getRange().getValues()[0];
  }
}
