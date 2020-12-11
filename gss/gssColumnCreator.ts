export interface ConfAbstractColumn {
  name: string;
  verboseName?: string;
  forceConvertion?: boolean;
  required?: boolean;
  column?: number;
  defaultValue?: any;
  functionValidators?: ((value: any) => any)[];
}


/*
 * AbstractColumn class.
 * */
export abstract class AbstractColumn {
  public name: string = '';

  public verboseName: string = '';

  public forceConvertion: boolean = false;

  public required?: boolean = false;

  public column?: number;

  public defaultValue?: any;
  
  public functionValidators?: ((value: any) => any)[];
  
  /*
   * Checks that a vuele meets the data required to be stored.
   * */
  public abstract validate(value: any): any;
  
  /*
   * Return a value as a string, this is used
   * in filter method from GssObjectsCreator.
   * */
  public abstract chain(value: any): any;
  
  /*
   * Assigns values to column properties. 
   * */
  public asignValues(conf: ConfAbstractColumn) {
    this.name = conf.name;
    this.verboseName = conf.verboseName || '';
    this.forceConvertion = conf.forceConvertion || false;
    this.required = conf.required || false;
    this.column = conf.column;
    this.defaultValue = conf.defaultValue || '';
    this.functionValidators = conf.functionValidators || [];
    return this;
  }

  /*
   * Run functions that extra validate or transform
   * a value to be saved.
   * */
  protected _extraValidators(valueTarget: any, functions: ((value: any) => any)[]): any {
    let value = valueTarget; 
    if (functions && functions.length > 0) {
      functions.forEach(fn => {
        value = fn(value);
      });
    }
    return value;
  }
}

/*
 * Generic column.
 * */
export class GenericColumn extends AbstractColumn {
  static create(values: ConfAbstractColumn): GenericColumn {
    return new GenericColumn().asignValues(values);
  }
  
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
    if (this.required && !value) throw new Error(`Fn: StringColumn, column: ${this.column}, value is required`);
    if (!value && this.defaultValue) return this.defaultValue;
    if (this.forceConvertion) return String(value);
    if (typeof value !== 'string') throw new Error(`Column ${this.column} must be a string but it receibed a ${typeof value}.`);
    return this._extraValidators(value, this.functionValidators);
  }

  public chain(value: string): string {
    return `'${value}'`;
  }
}

/*
 * Number column.
 * */
export class NumberColumn extends AbstractColumn {
  static create(payload: {}): NumberColumn {
    return new NumberColumn().asignValues(payload);
  }
  
  public bypass(value: any): number {
    return String(value)
  }

  public validate(value: number): number {
    if (this.required && !value) throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
    if (!value && this.defaultValue) return this.defaultValue;
    if (this.forceConvertion) return Number(value);
    if (typeof value !== 'number') throw new Error(`Column ${this.column} must be a number but it receibed a ${typeof value}.`);
    return value;
  }

  public chain(value: number | string): string {
    return `${typeof value === 'string' && !value ? '""' : value }`;
  }
}

/*
 * Datetime column
 * */
export class DateTimeColumn extends AbstractColumn {
  autoNowAdd: boolean = false;

  autoNow: boolean = false;

  static create(payload: {}): DateTimeColumn {
    return new DateTimeColumn().asignValues(payload);
  }

  public validate(value: Date | string): Date | string {
    if (this.required && !value) throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
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

  public chain(value: Date | string): string {
    return `new Date(${value})`;
  }
}
