import { AbstractColumn } from './columns/abstract_column';
import { Row } from './row';
import { AbstractColumn } from './columns/abstract_column';
import Query from './query';

/**
 * Interface
 */
interface CollectionValues {
  ssid: string;
  sheetName: string;
  columns: AbstractColumn[];
  columnIndex: Map;
  range: number[];
  values?: Row[];
  _isSubCollection?: boolean;
  _collectionType?: 'ordered' | 'unordered';
}

/**
 * Collection
 */
export default class Collection {
  private _ssid = '';

  private _sheetName = '';

  private _values: Row[] = [];

  private _columnIndex: Map = new Map();

  private _columns: AbstractColumn[] = [];

  private _range: number[];

  private _query: Query;

  constructor(conf: CollectionValues) {
    this._ssid = conf.ssid;
    this._sheetName = conf.sheetName;
    this._columns = conf.columns;
    this._columnIndex = conf.columnIndex;
    this._range = conf.range;
    this._values =
      'values' in conf && conf.values?.length > 0 ? conf.values : [];

    this._query = Query.create();
  }

  public static create(conf: CollectionValues) {
    return new Collection(conf);
  }

  private _getAllValues() {
    let startRow = this._range[0];

    const range = SpreadsheetApp.openById(this._ssid)
      .getSheetByName(this._sheetName)
      ?.getRange(...this._range);

    return range?.getValues().map((rowValues, index) => {
      // let row = startRow + index;
      let subRange = [...this._range];
      subRange[0] = startRow + index;
      subRange[2] = 1;

      return Row.create({
        ssid: this._ssid,
        sheetName: this._sheetName,
        columnsIndex: this._columnIndex,
        columns: this._columns,
        range: subRange,
        values: rowValues,
      });
    });
  }

  public values(): Row[] {
    return this._values;
  }

  public first() {
    const range = [...this._range];
    range[2] = this._range[0];
    range[3] = this._columns.length;

    return Row.create({
      ssid: this._ssid,
      sheetName: this._sheetName,
      columnsIndex: this._columnIndex,
      columns: this._columns,
      range: range,
    });
  }

  public last() {
    const range = [...this._range];

    range[0] = this._range[2];
    range[2] = 1;
    range[3] = this._columns.length;

    return Row.create({
      ssid: this._ssid,
      sheetName: this._sheetName,
      columnsIndex: this._columnIndex,
      columns: this._columns,
      range: range,
    });
  }

  public all(): Collection {
    return Collection.create({
      columnIndex: this._columnIndex,
      columns: this._columns,
      range: this._range,
      sheetName: this._sheetName,
      ssid: this._ssid,
      values: this._values.length < 1 ? this._getAllValues() : this._values,
    });
  }

  public where(
    columnName: string,
    operatorOrValue: string | number | boolean,
    value?: string | number | boolean
  ) {
    this._query.addAnd(columnName, operatorOrValue, value);
    return this;
  }

  public whereDate(
    columnName: string,
    operatorOrValue: string | Date,
    value?: Date
  ) {
    this._query.addAndDate(columnName, operatorOrValue, value);
    return this;
  }

  public runQueries() {
    const values =
      this._values.length > 0 ? this._values : this._getAllValues();
    const valuesFiltered = this._query.run(values);

    return Collection.create({
      columnIndex: this._columnIndex,
      columns: this._columns,
      range: this._range,
      sheetName: this._sheetName,
      ssid: this._ssid,
      values: valuesFiltered,
    });
  }
}
