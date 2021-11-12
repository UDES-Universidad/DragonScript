import { AbstractColumn } from './abstract_column';

/*
 * Boolean column
 * */
export default class BooleanColumn extends AbstractColumn {
  public static create(payload: {}): BooleanColumn {
    return new BooleanColumn().assignValues(payload);
  }

  public validate(value: boolean | string | number): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return Boolean(value);
    if (typeof value === 'string') {
      if (value === 'false') return false;
      if (value) return true;
      if (value === '') return false;
    }
    throw new Error(
      `Column ${
        this.column
      } must be a string but it receibed a ${typeof value}, value: ${value}`
    );
  }

  public toString(value: boolean): string {
    return String(value);
  }

  public transform(value: string | number | boolean) {
    if (!value) return value;

    if (typeof value === 'string' && ['true', 'false'].includes(value)) {
      return Boolean(value);
    }

    return Boolean(value);
  }

  public columType() {
    return 'BooleanColumn';
  }
}
