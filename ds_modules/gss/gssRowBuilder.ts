/*
 * Manages rows
 * */
export interface ConfParamsGssRow {
  columnsMap: {};
  data: any[];
  maxLength: number;
  row?: number;
}

export class GssRow {
  private _columnsMap: {} = {};

  private _data: any[] = [];

  private _row?: number | null;

  private _maxLength: number;

  constructor(conf: ConfParamsGssRow) {
    this._columnsMap = conf.columnsMap;
    this._data = conf.data;
    this._maxLength = conf.maxLength; 
    this._row = conf && conf.row ? conf.row : null;
  }

  /*
   * Returns row number.
   * */
  get row() {
    return this._row;
  }

  /*
   * Gets all data in array.
   * */
  get data(): any[] {
    return this._data.slice(0);
  }

  /**
   * Return data as object.
   * */
  get dataAsObj(): {} {
    const obj = {}
    this._data.forEach((el, index) => {
      const key = this._columnsMap[index];
      obj[key] = el;
    });
    return obj;
  }

  /**
   * Sets new data.
   * @param theDatas (any[]): data to row, it must have the same 
   * length of columns sheet.
   * */
  set data(theDatas: any[]) {
    if (theDatas.length === this._maxLength) this._data = theDatas;
    throw new Error('Data must have the same length of columns.');
  }

  /**
   * Gets the name or index of a column by his name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * */
  private getColum(columnNameOrNumber: string | number) {
    return typeof columnNameOrNumber === 'string' && columnNameOrNumber
      ? this._columnsMap[columnNameOrNumber]
      : columnNameOrNumber;
  }

  /**
   * Gets data column by his name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * */
  public getVal(columnNameOrNumber: string | number): any {
    const column = this.getColum(columnNameOrNumber);
    return this._data[column];
  }

  /**
   * Sets new data to column, based on its name or index.
   * @param columnNameOrNumber (string | number): column name
   * or number.
   * @param value (any): new value to cell.
   * */
  public setVal(columnNameOrNumber: string | number, value: any): void {
    const column = this.getColum(columnNameOrNumber);
    this._data[column] = value;
  }

}
