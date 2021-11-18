import { ColumnExtraValidationError } from './errors_column';

export interface ConfAbstractColumn {
  name: string;
  verboseName?: string;
  forceConversion?: boolean;
  required?: boolean;
  column?: number;
  defaultValue?: any;
  fnValidators?: { [keys: string]: (value: any) => boolean };
}

/*
 * AbstractColumn class.
 * */
export abstract class AbstractColumn {
  public name: string = '';

  public verboseName: string = '';

  public forceConversion: boolean = false;

  public required?: boolean = false;

  public column?: number;

  public defaultValue?: any;

  //public fnValidators;

  public fnValidators?: { [key: string]: (value: any) => boolean };

  /*
   * Checks that a value meets the data required to be stored.
   * */
  public abstract validate(value: any): any;

  /*
   * Return a value as a string, this is used
   * in filter method.
   * */
  public abstract toString(value: any): any;

  /*
   * Assigns values to column properties.
   * */
  public assignValues(conf: ConfAbstractColumn) {
    this.name = conf.name;
    this.verboseName = conf.verboseName || '';
    this.forceConversion = conf.forceConversion || false;
    this.required = conf.required || false;
    this.column = conf.column;
    this.defaultValue = conf.defaultValue || '';
    this.fnValidators = conf.fnValidators || {};
    return this;
  }

  /*
   * Run functions that extra validate or transform
   * a value to be saved.
   * */
  protected _extraValidators(
    valueTarget: any,
    functions: ((value: any) => any)[]
  ): any {
    let value = valueTarget;

    if (functions && functions.length > 0) {
      const extraFunctions = Object.entries(functions);

      extraFunctions.forEach((item) => {
        const fn = item[1];
        const result = fn(value);
        if (!result) {
          throw new ColumnExtraValidationError(
            `Validator fail: ${item[0]} on column ${this.name}.`
          );
        }
      });
    }

    return value;
  }

  /** Transform to Column type. */
  public abstract transform(value: any): any;

  public abstract columType(): string;
}
