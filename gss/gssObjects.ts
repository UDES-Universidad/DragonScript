import {AbstractColumn} from "./gssColumnCreator";
import { GssRow, ConfParamsGssRow } from "./gssRowBuilder";

// Interfaces
// ------------------------------------------------------------

/*
 * Interface for constructor parameters.
 * */
interface ConfParamsObjects {
  sheet: SpreadsheetApp.Spreadsheet.Sheet;
  columnsMap: {};
  table: AbstractColumn[];
  rowIndexes: number[];
}

/*
 * This interface is for mayor data getters
 * as getAll or filter. 
 * */
interface ConfMayorDataGetters {
  reverse?: boolean;
  removeFirstRow?: boolean;
  slice?: [number, number];
}

/*
 * 
 * */
interface ConfFilterData extends ConfMayorDataGetters {
  search: {};
}

// Classes
// ------------------------------------------------------------

/*
 * Objects class, this class is in charge to manage search
 * and get data from Spreadsheet table.
 * */
export default class GssObjectsCreator {
  private _rowBuilder = GssRow;

  private _sheet?: SpreadsheetApp.Spreadsheet.Sheet;

  private _rowIndexes: number[];

  private _columnMap: {};

  private _table: AbstractColumn[];

  private 

  constructor(conf: ConfParamsObjects) {
    this._sheet = conf.sheet;
    this._columnMap = conf.columnsMap;
    this._table = conf.table;
    if (conf.rowIndexes) this._rowIndexes = conf.rowIndexes;
  }

  private _createRow(dataforRow: ConfParamsGssRow) {
    return new this._rowBuilder({ ...dataforRow });
  }
  
  private _searchStatementConstructor(searchParams: [string, any][]) {
    let statement = '';
    searchParams.forEach((item, index) => {
      const [columnName, value] = item;
      const columnNumber = this._columnMap[columnName];
      if (index === 0) {
        statement += `datas[${columnNumber}] === ${value}`;
      } else {
        statement += `&& datas[${columnNumber}] === ${value}`;
      }
    });

    return statement;
  }

  private *_generator(theRowIndexes: number[], searchParams?: [string, any][]) {
    let searchStatement: string = '';
    if (searchParams && searchParams.length > 0) searchStatement = this._searchStatementConstructor(searchParams);
    for (const index of theRowIndexes) {
      const datas = this._sheet
        .getRange(index, 1, 1, this._sheet.getLastColumn())
        .getValues(); 
      if (searchStatement) {
        if (eval(searchStatement)) {
          const rowModel = this._createRow({
            columnsMap: this._columnMap,
            datas: datas && datas.length > 0 ? datas[0] : [], 
            row: Number(index),
            sheet: this._sheet,
            table: this._table,
          });
          yield rowModel;
        }
      } else {
        const rowModel = this._createRow({
          columnsMap: this._columnMap,
          datas: datas && datas.length > 0 ? datas[0] : [], 
          row: Number(index),
          sheet: this._sheet,
          table: this._table,
        });
        yield rowModel;
      }
    }
  } 

  public getRowByNumber(rowNumber: number): GssRow {
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
  
  /*
   * Return all data.
   * Parameter conversion priority:
   * 1. removeFirstRow
   * 2. reverse
   * 3. slice
   * */
  public getAll(conf?: ConfMayorDataGetters) {
    this._rowIndexes = this._rowIndexes && this._rowIndexes.length > 0
      ? this._rowIndexes 
      : Array.from(Array(this._sheet.getLastRow() + 1).keys()).slice(1);
    let dataToWork = this._rowIndexes.slice(0);
    if (conf) {
      if ('removeFirstRow' in conf && conf.removeFirstRow) dataToWork.shift();
      if ('reverse' in conf && conf.reverse) dataToWork.reverse();
      if('slice' in conf && conf.slice.length > 0) dataToWork = dataToWork.slice(conf.slice[0], conf.slice[1]);
    }
    return this._generator(dataToWork);
  } 
  
  /*
   * Gets datas by specific column-value.
   * */
  public filter(conf?: ConfFilterData) {

  }
}
