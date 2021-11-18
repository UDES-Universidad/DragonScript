import { AbstractColumn, ConfAbstractColumn } from './abstract_column';
import { GenericColumnError } from './errors_column';

/*
 * Generic column.
 * */
export default class GenericColumn extends AbstractColumn {
  public static create(values: ConfAbstractColumn): GenericColumn {
    return new GenericColumn().assignValues(values);
  }

  public validate(value: any): any {
    if (this.required && !value) {
      throw new GenericColumnError({
        errorType: 'required',
        columnName: this.name,
      });
    }

    let _value = this.transform(value);

    this._extraValidators(value, this.functionValidators);

    if (this.defaultValue) _value = this.defaultValue;

    return _value;
  }

  public toString(value: any) {
    return String(value);
  }

  public transform(value: any) {
    return value;
  }

  public columType() {
    return 'GenericColumn';
  }
}
