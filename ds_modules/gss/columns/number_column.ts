import { AbstractColumn, ConfAbstractColumn } from './abstract_column';

/*
 * Number column.
 * */
export default class NumberColumn extends AbstractColumn {
  public static create(payload: ConfAbstractColumn): NumberColumn {
    return new NumberColumn().assignValues(payload);
  }

  public validate(value: number): number {
    const _value = this.transform(value);
    if (this.required && !_value) {
      throw new Error(`Fn: StringColumn, column:·${_value}, value is required`);
    }

    if (!_value && this.defaultValue) {
      return this.defaultValue;
    }

    if (isNaN(_value)) {
      throw new Error('Validation E');
    }

    if (typeof _value !== 'number') {
      throw new Error(
        `Column ${
          this.column
        } must be a number but it receibed a ${typeof _value}, value: ${_value}`
      );
    }
    return value;
  }

  public toString(value: number | string): string {
    return `${typeof value === 'string' && !value ? '""' : value}`;
  }

  public transform(value: string | number): number {
    if (!value) return 0;

    return Number(value);
  }

  public columType() {
    return 'NumberColumn';
  }
}
