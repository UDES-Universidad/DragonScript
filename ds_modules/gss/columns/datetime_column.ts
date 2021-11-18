import { AbstractColumn } from './abstract_column';

/*
 * Datetime column
 * */
export default class DateTimeColumn extends AbstractColumn {
  autoNowAdd: boolean = false;

  autoNow: boolean = false;

  format: string = 'dd-MM-yyyy HH:mm:ss';

  timeZone: string = 'GMT-6';

  public static create(payload: {}): DateTimeColumn {
    return new DateTimeColumn().assignValues(payload);
  }

  private getGoogleDate(date?: Date) {
    const _date = date || new Date();
    return Utilities.formatDate(_date, this.timeZone, this.format);
  }

  public validate(value: Date | string): Date | string {
    if (this.required && !value)
      throw new Error(`Fn: StringColumn, column:·${value}, value is required`);
    if (this.autoNowAdd && !value) return this.getGoogleDate();
    if (this.autoNow) return this.getGoogleDate();
    if (value instanceof Date) {
      return this.getGoogleDate(value);
    }
    if (typeof value === 'string') {
      try {
        return this.getGoogleDate(new Date(value));
      } catch (e) {
        throw new Error(
          `Error: ${e}\n. Fn: DateTimeColumn, column: ${this.column}, value: ${value}`
        );
      }
    }
    if (!value) return '';
    throw new Error(
      `Error: Value must be string or Date instance.\n. Fn: DateTimeColumn, column: ${this.column}, value: ${value}`
    );
  }

  public toString(value: Date | string): string {
    return `new Date(${value})`;
  }

  public transform(value: string | Date): Date | string {
    if (!value) return '';

    return new Date(value);
  }

  public columType() {
    return 'DateTimeColumn';
  }
}
