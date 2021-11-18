import { AbstractColumn, ConfAbstractColumn } from './abstract_column';
import { StringColumnError } from './errors_column';

/*
 * String column.
 * */
export default class StringColumn extends AbstractColumn {
  public static create(payload: ConfAbstractColumn): StringColumn {
    return new StringColumn().assignValues(payload);
  }

  public validate(value: string): string {
    if (this.required && !value) {
      throw new StringColumnError({
        columnName: this.name,
        errorType: 'required',
      });
    }

    let _value = this.transform(value);

    if (!_value && this.defaultValue) return this.defaultValue;

    if (typeof value !== 'string') {
      throw new StringColumnError({
        columnName: this.name,
        errorType: 'wrongType',
        dataType: 'String',
        wrongType: typeof value,
      });
    }

    this._extraValidators(value, this.functionValidators);

    return _value;
  }

  public toString(value: string): string {
    return `'${value}'`;
  }

  public transform(value: any) {
    return String(value);
  }

  public columType() {
    return 'StringColumn';
  }
}
