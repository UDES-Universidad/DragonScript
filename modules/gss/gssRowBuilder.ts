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

  /*
   * Sets new data.
   * */
  set data(theDatas: any[]) {
    if (theDatas.length === this._maxLength) this._data = theDatas;
    throw new Error('Data must have the same length');
  }
  
  /*
   * Gets the name or index of a column by his name or index.
   * */
  private getColum(columnNameOrNumber: string | number) {
    return typeof columnNameOrNumber === 'string' && columnNameOrNumber
      ? this._columnsMap[columnNameOrNumber]
      : columnNameOrNumber;
  }
  
  /*
   * Gets data column by his name or index.
   * */
  public getVal(columnNameOrNumber: string | number): any {
    const column = this.getColum(columnNameOrNumber);
    return this._data[column];
  }
  
  /*
   * Sets new data to column, based on its name or index.
   * */
  public setVal(columnNameOrNumber: string | number, value: any): void {
    const column = this.getColum(columnNameOrNumber);
    this._data[column] = value;
  }
  
}
