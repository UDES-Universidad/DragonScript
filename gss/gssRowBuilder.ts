/*
 * Manages rows
 * */

import {AbstractColumn} from "./gssColumnCreator";

export interface ConfParamsGssRow {
  sheet: SpreadsheetApp.Spreadsheet.sheet;
  table: AbstractColumn[];
  columnsMap: {};
  datas: any[];
  row: number;
}

export class GssRow {
  private _sheet?: SpreadsheetApp.Spreadsheet.Sheet;

  private _table?: AbstractColumn[];

  private _columnsMap: {} = {};

  private _datas: any[] = [];

  private _row?: number;

  constructor(conf: ConfParamsGssRow) {
    this._sheet = conf.sheet;
    this._table = conf.table;
    this._columnsMap = conf.columnsMap;
    this._datas = conf.datas;
    this._row = conf.row;
  }

  get datas(): any[] {
    return this._datas.slice(0);
  }

  set datas(theDatas: any[]) {
    this._datas = theDatas.map((data, index) => this.validator(index).validate(data));
  }

  private getColum(columnNameOrNumber: string | number) {
    return typeof columnNameOrNumber === 'string' && columnNameOrNumber
      ? this._columnsMap[columnNameOrNumber]
      : columnNameOrNumber;
  }

  private validator(column: number): AbstractColumn {
    return this._table[column];
  }

  public getData(columnNameOrNumber: string | number): any {
    const column = this.getColum(columnNameOrNumber);
    return this._datas[column];
  }

  public setData(columnNameOrNumber: string | number, value: any): void {
    const column = this.getColum(columnNameOrNumber);
    this._datas[column] = value;
  }

  public save(): void {
    const datasToSave = this._datas.map((data, index) => this.validator(index).validate(data));
    const range = this._sheet.getRange(1, this._row, 1, this._datas.length);
    range.setValues([datasToSave]);
  }
}
