/*
 * AbstractColumn class.
 * */
abstract class AbstractColumn {
  protected _name: string = '';

  get name() {
    return this._name.substr(0);
  }

  set name(theName: string) {
    if (typeof theName !== 'string') {
      throw new Error('name requires a string value.');
    }
    this._name = theName;
  }

  protected _verboseName: string = '';

  get verboseName() {
    return this._verboseName.substr(0);
  }

  set verboseName(theVerboseName: string) {
    if (typeof theVerboseName !== 'string') {
      throw new Error('verboseName requires a string value.');
    }
    this._verboseName = theVerboseName;
  }

  protected _column?: number;

  get column(): number {
    return this.column;
  }

  set column(theColumn: number) {
    if (typeof theColumn !== 'number') {
      throw new Error('Column must be a number.');
    }
    this._column = theColumn;
  }

  protected _forceConvertion: boolean = false;

  get forceConvertion() {
    return this._forceConvertion;
  }

  set forceConvertion(force: boolean) {
    this._forceConvertion = force;
  }

  protected _defaultValue?: any;

  get defaultValue() {
    return this._defaultValue;
  }

  set defaultValue(value: any) {
    this._defaultValue = value;
  }

  public abstract validate(value: any): any;
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
  public validate(value: any): string {
    if (!value && this._defaultValue) return this._defaultValue;
    if (this._forceConvertion) return String(value);
    if (typeof value !== 'string') throw new Error(`Column ${this._column} must be a string but ir receibed and ${typeof value}.`);
    return value;
  }
}
