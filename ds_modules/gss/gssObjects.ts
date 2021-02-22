import {ConfParamsGssRow, GssRow} from "./gssRowBuilder";
import {AbstractColumn} from "./gssColumnCreator";

/*
 * OBJECTS
 * *

// Interfaces
// ------------------------------------------------------------

/*
 * Interface for constructor parameters.
 * */
interface ConfParamsObjects {
  sheet: SpreadsheetApp.Spreadsheet.Sheet;
  columnsMap: {};
  table: AbstractColumn[];
  rows?: GssRow[];
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
 * Interface for rowGenerator.
 * */
interface ConfRowGenerator {
  startAtRow?: number;
  rowsNumber?: number;
  reverse?: number;
}

/*
 * Interface for geAll method.
 * */
interface ConfGetAll extends ConfMayorDataGetters {
}

/*
 * Interface for filter method.
 * */
interface ConfFilterData extends ConfMayorDataGetters {
  search: {};
}

/*
 * Interface for filterBySheetRange.
 * */
interface ConfGetBySheetRange extends ConfMayorDataGetters {
  range: number[];
  search?: {};
}

/**
 * It is used for row creation.
 * @param data (any[]): dato for row.
 * @param row (number): row number.  
 * */
interface ConfLocalCreationRow {
  data: any[];
  row?: number;
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

  private _rows: GssRow[] = [];

  private _columnsMap: {};

  private _table: AbstractColumn[];

  constructor(conf: ConfParamsObjects) {
    this._sheet = conf.sheet;
    this._columnsMap = conf.columnsMap;
    this._table = conf.table;
    if (conf.rows && conf.rows.length > 0) this._rows = conf.rows;
  }

  /**
   * Returns an GssRow[].
   * */
  get Rows() {
    return this._rows;
  }
  
  /**
   * Creates an GssObjectsCreator instance.
   * @param rows (GssRow[]): array of GssRow instances, this array 
   * will be used to avoid bringing back the data from 
   * the spreadsheet. 
   * */
  private _ObjectsCreator(rows: GssRow[]) {
    return new GssObjectsCreator({
      columnsMap: this._columnsMap,
      rows,
      sheet: this._sheet,
      table: this._table,
    })
  }

  /**
   * Row creator
   * @param dataforRow (ConfLocalCreationRow): is an configuration
   * object made up of:
   * @param data (any[]): dato for row.
   * @param row (number): row number.
   * */
  private _createRow(dataforRow: ConfLocalCreationRow) {
    let conf: ConfParamsGssRow = {
      maxLength: this._table.length,
      columnsMap: this._columnsMap, 
      ...dataforRow,
    };
    return new this._rowBuilder(conf);
  }

  /*
   * Creates a statement for search in data.
   * */
  private _searchStatement(searchParams: [string, any][]) {
    let statement = '';
    searchParams.forEach((item, index) => {
      const [columnName, value] = item;
      const columnNumber = this._columnsMap[columnName];
      const validator = this._table[columnNumber];
      if (index === 0) {
        statement += `row.getVal('${columnName}') === ${validator.chain(value)}`;
      } else {
        statement += ` && row.getVal('${columnName}') === '${validator.chain(value)}'`;
      }
    });
    return statement;
  }

  /*
   * Gets data from table in Spreadsheet, and return it
   * as a array of GssRow, and removes the first row.
   * */
  private _retrieveDataFromTable() {
    this._rows = this._rows && this._rows.length > 0 
      ? this._rows
      : this._sheet.getDataRange().getValues().map((data: any[], index: number) => this._createRow({
        row: index + 1,
        data,
      }));
    this._rows.shift();
    return this._rows;
  }

  /*
   * Returns a validator, it is used to specify 
   * that the data to save is the correct data type.
   * */
  private _validator(column: number): AbstractColumn {
    return this._table[column];
  }

  /**
   * Save a row values to Sheet.
   * @param row: instance of gssRow.
   * */
  public saveRow(row: GssRow) {
    const dataToSave = row.data.map((value, index) => this._validator(index).validate(value));
    if (row.row) {
      const range = this._sheet.getRange(row.row, 1, 1, row.data.length);
      range.setValues([dataToSave]);
    } else {
      this._sheet.appendRow(dataToSave);
    }
  }

  /**
   * Creates a blank row. Returns a GssRow instance.
   * @param data (any[]): data to new row.
   * */
  public newRow(data?: any[]): GssRow {
    const row = this._createRow({
      data: Array(this._table.length).fill(''),
    });
    if (data && data.length > 0) row.data = data;
    this._rows.push(row);
    return row;
  }

  /**
   * Gets a row values by its number.
   * @param rowNumber (number): row number.
   * */
  public getRowByNumber(rowNumber: number): GssRow {
    const range = this._sheet
      .getRange(rowNumber, 1, 1, this._sheet.getLastColumn());
    const values = range.getValues();
    return this._createRow({
      row: rowNumber,
      data: values.length > 0 ? values[0] : [],
    });
  }

  /**
   * Gets data from Spreadsheet table and return it as a generator.
   * This method allows return most recent data from table.
   * @param conf (ConfRowGenerator): is made up of:
   * @param startAtRow: row where will start the iteration.
   * @param rowNumber: how many rows will be iterate.
   * @param reverse: if the iteration will be in reverse.
   * */
  public *rowGenerator(conf: ConfRowGenerator) {
    let loop = 0;
    let index = 0;
    const startAtRow = conf && 'startAtRow' in conf 
      ? conf.startAtRow 
      : 2;
    const reverse = conf && 'reverse' in conf 
      ? conf.reverse 
      : false;
    let rowsNumber;
    if (conf && 'startAtRow' in conf && 'rowsNumber' in conf) {
      rowsNumber = conf.rowsNumber <= this._sheet.getLastRow()
        ? conf.rowsNumber
        : this._sheet.getLastRow();
    }
    if (conf && 'startAtRow' in conf && !('rowsNumber' in conf)) {
      rowsNumber = 'reverse' in conf
        ? conf.startAtRow - 1
        : (this._sheet.getLastRow() + 1) - conf.startAtRow;
    }
    if (!conf) {
      rowsNumber = this._sheet.getLastRow() - 1;
    }
    while (loop < rowsNumber) {
      if (reverse) {
        index = startAtRow - loop;
      } else {
        index = startAtRow + loop;
      }
      const data = this._sheet.getRange(
        index, 1, 1, this._sheet.getLastColumn(),
      ).getValues()[0];
      yield this._createRow({
        row: index,
        data,
      });
      loop += 1;
    }
  }

  /*
   * Return all data by two strategies:
   * 1. Brute: get all data of table as a snapshot and transforms 
   * it in to a array of GssRow.
   * 2. Generator: Get row by row from Spreadsheet with method 
   * Sheet.getRange().getValues(), this allows return the most recent value
   * of row. Every yield return a GssRow. This strategy could be slowly. All 
   * rows are saved in the property _rows.
   * */
  public getAll(conf?: ConfGetAll) {
    let rows = this._retrieveDataFromTable();
    if (conf) {
      if('slice' in conf && conf.slice.length > 0) rows = rows.slice(...conf.slice);
      if ('reverse' in conf && conf.reverse) rows.reverse();
    }
    return this._ObjectsCreator(rows);
  }

  /*
   * Gets data by specific column-value.
   * Parameter conversion priority:
   * 1. slice
   * 2. reverse
   * TODO: add super sexy search keys like email__endsWith: '@udes.edu.mx'.
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
    });
    return this._ObjectsCreator(results);
  }

  /*
   * Gets data from sheet by a custom range, 
   * and it can search terms.
   * */
  public GetBySheetRange(conf: ConfGetBySheetRange) {
    const results: GssRow[] = [];
    const statement = 'search' in conf 
      ? this._searchStatement(Object.entries(conf.search))
      : "";
    let rows = this._sheet.getRange(...conf.range).getValues()
      .map((data: any[], index: number) => {
      return this._createRow({
        data,
        row: index + 1,
      });
    });
    if (conf) {
      if('slice' in conf && conf.slice.length > 0) rows = rows.slice(...conf.slice);
      if ('reverse' in conf && conf.reverse) rows.reverse();
    }
    if (statement){
      rows.forEach((row: GssRow) => {
        if (eval(statement)) results.push(row);
      });
      return this._ObjectsCreator(results);
    } 
    return this._ObjectsCreator(this._rows);
  }

  /*
   * TODO: Add exclude method.
   * */
}
