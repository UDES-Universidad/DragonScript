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
  datas: GssRow[];
}

/*
 * This interface is for mayor data getters
 * as getAll or filter. 
 * */
interface ConfMayorDataGetters {
  reverse?: boolean;
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

  private _rows: GssRow[];

  private _columnMap: {};

  private _table: AbstractColumn[];

  constructor(conf: ConfParamsObjects) {
    this._sheet = conf.sheet;
    this._columnMap = conf.columnsMap;
    this._table = conf.table;
    if (conf.datas && conf.datas.length > 0) this._rows = conf.datas;
  }

  get Rows() {
    return this._rows;
  }
  
  private _ObjectsCreator(datas: GssRow[]) {
    return new GssObjectsCreator({
      columnsMap: this._columnMap,
      datas,
      sheet: this._sheet,
      table: this._table,
    })
  }

  /*
   * Row creator
   * */
  private _createRow(dataforRow: ConfParamsGssRow) {
    return new this._rowBuilder({ ...dataforRow });
  }
  
  /*
   * Creates a statement for search in datas.
   * */
  private _searchStatement(searchParams: [string, any][]) {
    let statement = '';
    searchParams.forEach((item, index) => {
      const [columnName, value] = item;
      const columnNumber = this._columnMap[columnName];
      const validator = this._table[columnNumber];
      if (index === 0) {
        statement += `row.getData('${columnName}') === ${validator.chain(value)}`;
      } else {
        statement += ` && row.getData('${columnName}') === '${validator.chain(value)}'`;
      }
    });
    
    return statement;
  }
  
  private _retrieveDataFromTable() {
    this._rows = this._rows && this._rows.length > 0 
      ? this._rows
      : this._sheet.getDataRange().getValues().map((datas: any[], index: number) => {
        return this._createRow({
          row: index + 1,
          table: this._table,
          sheet: this._sheet,
          columnsMap: this._columnMap,
          datas,
        });
      });
    this._rows.shift();
    return this._rows;
  }

  /*
   * Gets a row values by its number.
   * */
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
   * */
  public getAll() {
    return this._retrieveDataFromTable();
  } 
  
  /*
   * Gets datas by specific column-value.
   * Parameter conversion priority:
   * 1. slice
   * 2. reverse
   * */
  public filter(conf?: ConfFilterData) {
    this._rows = this._retrieveDataFromTable();
    let indexes = Array.from(Array(this._rows.length).keys()); 
    let results: GssRow[] = [];
    const statement = this._searchStatement(Object.entries(conf.search));
    if (conf) {
      if('slice' in conf && conf.slice.length > 0) indexes = indexes.slice(...conf.slice);
      if ('reverse' in conf && conf.reverse) indexes.reverse();
    }
    indexes.forEach(i => {
      const row = this._rows[i];
      if (eval(statement)) results.push(row);      
    })
    return this._ObjectsCreator(results);
  }
}
