/*
 * AbstractColumn class.
 * */
abstract class AbstractColumn {
  public name: string = '';

  public verboseName: string = '';

  public forceConvertion: boolean = false;

  public required?: boolean = false;

  public column?: number;

  public defaultValue?: any;

  public abstract validate(value: any): any;

  public asignValues(payload: {}) {
    Object.entries(payload).forEach((el) => {
      if (el[0] in this) {
        const [key, value] = el;
        this[key] = value;
      }
    });
    return this;
  }
}

/*
 * Generic column.
 * */
export class GenericColumn extends AbstractColumn {
  public validate(value: any): any {
    return value;
  }
}

/*
 * String column.
 * */
export class StringColumn extends AbstractColumn {
  static create(payload: {}): StringColumn {
    return new StringColumn().asignValues(payload);
  }

  public validate(value: string): string {
    if (this.required) throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
    if (!value && this.defaultValue) return this.defaultValue;
    if (this.forceConvertion) return String(value);
    if (typeof value !== 'string') throw new Error(`Column ${this.column} must be a string but it receibed a ${typeof value}.`);
    return value;
  }
}

/*
 * Number column.
 * */
export class NumberColumn extends AbstractColumn {
  static create(payload: {}): NumberColumn {
    return new NumberColumn().asignValues(payload);
  }

  public validate(value: number): number {
    if (this.required) throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
    if (!value && this.defaultValue) return this.defaultValue;
    if (this.forceConvertion) return Number(value);
    if (typeof value !== 'number') throw new Error(`Column ${this.column} must be a string but it receibed a ${typeof value}.`);
    return value;
  }
}

/*
 * Date column
 * */
export class DateTimeColumn extends AbstractColumn {
  autoNowAdd: boolean = false;

  autoNow: boolean = false;

  static create(payload: {}): DateTimeColumn {
    return new DateTimeColumn().asignValues(payload);
  }

  public validate(value: Date | string): Date | string {
    if (this.required) throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
    if (this.autoNowAdd && !value) return new Date();
    if (this.autoNow) return new Date();
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      try {
        return new Date(value);
      } catch (e) {
        throw new Error(`Error: ${e}\n. Fn: DateTimeColumn, column: ${this.column}, value: ${value}`);
      }
    }
    if (!value) return '';
    throw new Error(`Error: Value must be string o Date instance.\n. Fn: DateTimeColumn, column: ${this.column}, value: ${value}`);
  }
}
