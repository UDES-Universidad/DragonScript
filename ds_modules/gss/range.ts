import { AbstractColumn } from './columns/abstract_column';
import Collection from './collection';
export interface RangeBaseConf {
  ssid: string;
  sheetName: string;
  name: string;
  columns: AbstractColumn[];
  range?: number[];
  hasHeaders?: boolean;
  dynamicCols?: boolean;
}

interface RangeWithOptionalsConf extends RangeBaseConf {
  sheetRange: GoogleAppsScript.Spreadsheet.Range;
}

export class RangeSheet {
  private _ssid = '';

  private _sheetName = '';

  private _columns: AbstractColumn[] = [];

  private _columnIndex: Map = new Map();

  private _name: string;

  private _range: number[] = [];

  private _sheetRange: GoogleAppsScript.Spreadsheet.Range;

  constructor(conf: RangeWithOptionalsConf) {
    this._ssid = conf.ssid;
    this._sheetName = conf.sheetName;
    this._columns = conf.columns;
    this._name = conf.name;
    this._range = conf.range;
    this._sheetRange = conf.sheetRange;

    /**
     * This is the correct order of execution.
     * DON'T CHANGE.
     */
    this._createColumnIndex();
  }

  public static create(conf: RangeBaseConf) {
    return new RangeSheet(conf);
  }

  get name(): string {
    return this._name;
  }

  /**
   * Create column index.
   */
  private _createColumnIndex() {
    this._columns.forEach((col, index) => {
      this._columnIndex.set(col.name, index);
      this._columnIndex.set(index, col.name);
    });
  }

  /**
   * Get values as a collection.
   * @returns {Collection}
   */
  public rows(): Collection {
    return Collection.create({
      ssid: this._ssid,
      sheetName: this._sheetName,
      columns: this._columns,
      columnIndex: this._columnIndex,
      range: this._range,
    });
  }

  public saveInBlock() {}
}
