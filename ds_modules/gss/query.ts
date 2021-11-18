import { Row } from './row';

export default class Query {
  private _andQueries: string[] = [];

  public static create() {
    return new Query();
  }

  public addAnd(
    columnName: string,
    operatorOrValue: string | number | boolean,
    value?: string | number | boolean
  ): void {
    columnName = `'${columnName}'`;

    if (columnName && operatorOrValue && !value) {
      operatorOrValue =
        typeof operatorOrValue === 'string'
          ? `"${operatorOrValue}"`
          : operatorOrValue;

      this._andQueries.push(`value.get(${columnName}) === ${operatorOrValue}`);
    } else if (columnName && operatorOrValue && value) {
      value = typeof value === 'string' ? `'${value}'` : value;
      this._andQueries.push(
        `value.get(${columnName}) ${operatorOrValue} ${value}`
      );
    }
  }

  public addAndDate(
    columnName: string,
    operatorOrValue: string | Date,
    value?: Date
  ) {
    columnName = `'${columnName}'`;

    if (columnName && operatorOrValue && !value) {
      this._andQueries.push(
        `(value.get(${columnName}) && value.get(${columnName}).getTime() === ${operatorOrValue.getTime()})`
      );
    } else if (columnName && operatorOrValue && value) {
      this._andQueries.push(
        `(value.get(${columnName}) && value.get(${columnName}).getTime() ${operatorOrValue} ${value.getTime()})`
      );
    }
  }

  public run(values: Row[]): Row[] {
    const queryString = this._andQueries.join(' && ');
    const valuesFiltered = [];

    for (const value of values) {
      if (eval(queryString)) {
        valuesFiltered.push(value);
      }
    }

    return valuesFiltered;
  }
}
