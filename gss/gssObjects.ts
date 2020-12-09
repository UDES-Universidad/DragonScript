import {AbstractColumn} from "./gssColumnCreator";
import { GssRow, ConfParamsGssRow } from "./gssRowBuilder";

interface ConfParamsObjects {
  sheet: SpreadsheetApp.Spreadsheet.Sheet;
  columnsMap: {};
  table: AbstractColumn[];
  rowIndexes: number[];
}

export default class GssObjectsCreator {
  private _rowBuilder = GssRow;

  private _sheet?: SpreadsheetApp.Spreadsheet.Sheet;

  private _rowIndexes: number[];

  private _columnMap: {};

  private _table: AbstractColumn[];

  constructor(conf: ConfParamsObjects) {
    this._sheet = conf.sheet;
    this._columnMap = conf.columnsMap;
    this._table = conf.table;
    this._rowIndexes = conf.rowIndexes && conf.rowIndexes.length > 0 
      ? conf.rowIndexes 
      : Array.from(Array(this._sheet.getLastRow()).keys());
  }

  private _createRow(datoforRow: ConfParamsGssRow) {
    return new this._rowBuilder({ ...datoforRow });
  }
  
  private *_generator(theRowIndexes: number[]) {
     for (index in theRowIndexes) {}
  } 

  public getByRowNumber(rowNumber: number) {
    const range = this._sheet
      .getRange(rowNumber, 1, 1, this._sheet.getLastColumn());
    const values = range.getValues();
    return this._createRow({
      row: rowNumber,
      datas: values.length > 0 ? values[0] : [],
      sheet: this._sheet,
      table: this._table,
      columnsMap: this._columnMap,
    });
  }


}
